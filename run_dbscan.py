"""
DBSCAN accident hotspot prototype.
Usage:
  python run_dbscan.py indian_roads_dataset.csv
Dependencies:
  pip install pandas numpy scikit-learn folium
Outputs are saved to ./output/
NOTE: Results are exploratory. Validate data provenance before real-world claims.
"""
import os, sys
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
import folium

EARTH_RADIUS_KM = 6371.0088
EPS_KM = 1.0
MIN_SAMPLES = 10

def main():
    input_csv = sys.argv[1] if len(sys.argv) > 1 else "indian_roads_dataset.csv"
    df = pd.read_csv(input_csv)
    required = {"city", "latitude", "longitude", "accident_id", "accident_severity", "casualties", "risk_score"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    df = df.dropna(subset=["city", "latitude", "longitude"]).copy()
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
    df = df.dropna(subset=["latitude", "longitude"])
    df = df[df["latitude"].between(-90, 90) & df["longitude"].between(-180, 180)].copy()
    if df.empty:
        raise ValueError("No valid coordinates found.")

    coords_rad = np.radians(df[["latitude", "longitude"]].to_numpy())
    labels = np.full(len(df), -1, dtype=int)
    next_id = 0
    for city, indices in df.groupby("city").groups.items():
        ix = np.asarray(list(indices), dtype=int)
        model = DBSCAN(eps=EPS_KM / EARTH_RADIUS_KM, min_samples=MIN_SAMPLES,
                       metric="haversine", algorithm="ball_tree")
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

    os.makedirs("output", exist_ok=True)
    df.to_csv("output/accidents_with_clusters.csv", index=False)
    clustered = df[df["cluster_id"] != -1]
    summary = clustered.groupby(["city", "cluster_id"]).agg(
        accident_count=("accident_id", "size"),
        latitude=("latitude", "mean"),
        longitude=("longitude", "mean"),
        fatal_records=("accident_severity", lambda s: s.astype(str).str.lower().eq("fatal").sum()),
        total_casualties=("casualties", "sum"),
        avg_risk_score=("risk_score", "mean"),
    ).reset_index().sort_values("accident_count", ascending=False)
    summary.to_csv("output/hotspot_summary.csv", index=False)

    city_summary = df.groupby("city").agg(
        records=("accident_id", "size"),
        clustered_records=("is_hotspot", "sum"),
        noise_records=("is_hotspot", lambda s: (~s).sum()),
    ).reset_index()
    city_summary["clustered_percent"] = (100 * city_summary["clustered_records"] / city_summary["records"]).round(2)
    city_summary.to_csv("output/city_summary.csv", index=False)

    center = [float(df["latitude"].median()), float(df["longitude"].median())]
    map_obj = folium.Map(
    location=center,
    zoom_start=5,
    tiles="https://api.maptiler.com/maps/streets-v4/256/{z}/{x}/{y}.png?key=VsUOjmtWFc4PsDTzXWBK",
attr="MapTiler",
)

    for _, row in summary.head(250).iterrows():
        count = int(row["accident_count"])
        fatal = int(row["fatal_records"])
        

        if fatal > 0:
            hotspot_color = "red"
        elif float(row["avg_risk_score"]) >= 0.7:
            hotspot_color = "orange"
        else:
            hotspot_color = "green"

        popup = (f"<b>{row['city']}</b><br>Cluster: {int(row['cluster_id'])}"
                 f"<br>Records: {count}<br>Fatal-labelled: {int(row['fatal_records'])}"
                 f"<br>Casualties: {int(row['total_casualties'])}"
		 f"<br>Average Risk Score: {float(row['avg_risk_score']):.2f}"
                 "<br><i>Exploratory; data may be synthetic.</i>")
        folium.CircleMarker([row["latitude"], row["longitude"]],
            radius=max(3, min(10, 2 + np.sqrt(count) * 0.8)), popup=folium.Popup(popup, max_width=300),
            tooltip=f"{row['city']} - {count} records", color=hotspot_color,
            fill=True, fill_opacity=0.65).add_to(map_obj)
    map_obj.save("output/hotspot_map.html")
    print(f"Processed {len(df):,} records")
    print(f"Clusters: {df.loc[df.cluster_id != -1, 'cluster_id'].nunique():,}")
    print(f"Noise records: {(df.cluster_id == -1).sum():,}")
    print("Open output/hotspot_map.html in a browser to view the map.")

if __name__ == "__main__":
    main()
