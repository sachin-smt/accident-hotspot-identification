
import os
import mysql.connector
import numpy as np
import pandas as pd
from getpass import getpass
from sklearn.cluster import DBSCAN

EARTH_RADIUS_KM = 6371.0088
EPS_KM = 1.0
MIN_SAMPLES = 10


def main():
    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password=getpass("MySQL password: "),
            database="accident_hotspot_db"
        )

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT accident_id, city, latitude, longitude,
                   accident_severity, casualties, risk_score
            FROM accidents
        """)
        rows = cursor.fetchall()

        df = pd.DataFrame(rows)
        print(f"Loaded {len(df):,} records from MySQL")

        if df.empty:
            raise ValueError("No accident records found.")

        df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
        df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
        df["casualties"] = pd.to_numeric(df["casualties"], errors="coerce")
        df["risk_score"] = pd.to_numeric(df["risk_score"], errors="coerce")

        df = df.dropna(subset=["city", "latitude", "longitude"]).copy()
        df = df[
            df["latitude"].between(-90, 90)
            & df["longitude"].between(-180, 180)
        ].copy()

        if df.empty:
            raise ValueError("No valid coordinates found.")

        df = df.reset_index(drop=True)
        coords_rad = np.radians(
            df[["latitude", "longitude"]].to_numpy(dtype=float)
        )

        labels = np.full(len(df), -1, dtype=int)
        next_id = 0

        for city, indices in df.groupby("city").groups.items():
            ix = np.asarray(list(indices), dtype=int)

            model = DBSCAN(
                eps=EPS_KM / EARTH_RADIUS_KM,
                min_samples=MIN_SAMPLES,
                metric="haversine",
                algorithm="ball_tree"
            )
            local_labels = model.fit_predict(coords_rad[ix])

            for local in sorted(set(local_labels)):
                mask = local_labels == local
                if local == -1:
                    labels[ix[mask]] = -1
                else:
                    labels[ix[mask]] = next_id
                    next_id += 1

        df["cluster_id"] = labels
        df["is_hotspot"] = df["cluster_id"] != -1

        clustered = df[df["cluster_id"] != -1]
        summary = clustered.groupby(["city", "cluster_id"]).agg(
            accident_count=("accident_id", "size"),
            latitude=("latitude", "mean"),
            longitude=("longitude", "mean"),
            fatal_records=(
                "accident_severity",
                lambda s: s.astype(str).str.lower().eq("fatal").sum()
            ),
            total_casualties=("casualties", "sum"),
            avg_risk_score=("risk_score", "mean")
        ).reset_index()

        # Write output files before touching the database.
        os.makedirs("output", exist_ok=True)
        df.to_csv("output/accidents_with_clusters_mysql.csv", index=False)
        summary.to_csv("output/hotspot_summary_mysql.csv", index=False)

        # Prepare all database writes in one transaction.
       

        cursor = connection.cursor()
        cursor.executemany(
            "UPDATE accidents SET cluster_id=%s, is_hotspot=%s WHERE accident_id=%s",
            [
                (int(row.cluster_id), int(row.is_hotspot), int(row.accident_id))
                for row in df.itertuples(index=False)
            ]
        )

        cursor.execute("DELETE FROM hotspots")

        cursor.executemany("""
            INSERT INTO hotspots
                (city, cluster_id, accident_count, latitude, longitude,
                 fatal_records, total_casualties, avg_risk_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, [
            (
                str(row.city),
                int(row.cluster_id),
                int(row.accident_count),
                float(row.latitude),
                float(row.longitude),
                int(row.fatal_records),
                int(row.total_casualties) if pd.notna(row.total_casualties) else 0,
                float(row.avg_risk_score) if pd.notna(row.avg_risk_score) else 0.0
            )
            for row in summary.itertuples(index=False)
        ])

        connection.commit()

        print("MySQL update successful!")
        print(f"Accident rows processed: {len(df):,}")
        print(f"Hotspot rows saved: {len(summary):,}")
        print("CSV outputs saved in output/")

    except Exception as error:
        if connection is not None and connection.is_connected():
            connection.rollback()
        print("Operation failed; database transaction rolled back.")
        print(f"Details: {error}")

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    main()
