# Accident Hotspot Identification — DBSCAN Prototype

## What this prototype does
- Reads `indian_roads_dataset.csv`
- Applies DBSCAN independently within each city
- Uses geographic distance (Haversine) rather than Euclidean degrees
- Prototype settings: epsilon = 1.0 km, minimum samples = 10
- Writes cluster labels, a hotspot summary, city summary, and an interactive HTML map

## Files
- `run_dbscan.py` — rerunnable Python script
- `accidents_with_clusters.csv` — every record with `cluster_id` and `is_hotspot`
- `hotspot_summary.csv` — cluster centroid and counts
- `city_summary.csv` — clustered/noise record totals by city
- `hotspot_map.html` — interactive map of the largest clusters
- `README.txt` — this guide

## How to run on Windows
1. Put `run_dbscan.py` and `indian_roads_dataset.csv` in the same folder.
2. Open PowerShell in that folder.
3. Install dependencies:
   `py -m pip install pandas numpy scikit-learn folium`
4. Run:
   `py run_dbscan.py indian_roads_dataset.csv`
5. Open `output\hotspot_map.html` in Edge or Chrome.

## How to interpret
- `cluster_id >= 0`: DBSCAN assigned the record to a spatial cluster.
- `cluster_id == -1`: DBSCAN considered it noise/outlier under these settings.
- A cluster centroid is the average latitude/longitude of the records in that cluster.
- `fatal_records` counts rows whose `accident_severity` value is exactly `fatal` (case-insensitive).
- The clusters are not predictions of future accidents.

## Important limitation
The Kaggle dataset's provenance has not been independently verified and its coordinate patterns may be synthetic or generated. Treat these outputs as a technical prototype only. Do not claim the hotspots are verified real-world black spots. Validate data source, coordinate-city consistency, and labels before any real-world use.

## Parameters to experiment with
- `EPS_KM = 0.5`, `1.0`, `2.0` — neighborhood radius
- `MIN_SAMPLES = 5`, `10`, `20` — minimum density for a cluster
Do not choose settings only because they produce more clusters; compare results against known locations or validated data.
