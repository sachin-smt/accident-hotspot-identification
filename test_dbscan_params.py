
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN

EARTH_RADIUS_KM = 6371.0088
MIN_SAMPLES = 10

df = pd.read_csv("indian_roads_dataset.csv")
df = df.dropna(subset=["city", "latitude", "longitude"]).copy()

df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
df = df.dropna(subset=["latitude", "longitude"])
df = df[
    df["latitude"].between(-90, 90)
    & df["longitude"].between(-180, 180)
].copy()

print("DBSCAN radius comparison")
print("-" * 65)

for eps_km in [1.0, 2.0, 3.0]:
    labels_all = pd.Series(-1, index=df.index, dtype=int)
    next_id = 0

    for city, indices in df.groupby("city").groups.items():
        coords = np.radians(
            df.loc[indices, ["latitude", "longitude"]].to_numpy()
        )
        labels = DBSCAN(
            eps=eps_km / EARTH_RADIUS_KM,
            min_samples=MIN_SAMPLES,
            metric="haversine",
            algorithm="ball_tree",
        ).fit_predict(coords)

        for label in sorted(set(labels)):
            if label == -1:
                continue
            labels_all.loc[np.array(list(indices))[labels == label]] = next_id
            next_id += 1

    noise = int((labels_all == -1).sum())
    clusters = len(set(labels_all) - {-1})
    print(
        f"EPS={eps_km:.1f} km | Clusters={clusters} "
        f"| Noise={noise:,} ({noise / len(df) * 100:.1f}%)"
    )

print("-" * 65)
print("Comparison complete. Original files were not modified.")
