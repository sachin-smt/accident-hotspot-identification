# Backend requirements for frontend

The frontend is intentionally limited to the existing read-only endpoints:

- `GET /api/health`
- `GET /api/hotspots`

No backend files, configuration, database tables, Python scripts, or API endpoints were changed.

| Missing endpoint/data | Frontend area | Required fields | Impact | Current fallback |
|---|---|---|---|---|
| Complete accident totals and noise counts | Dashboard, Records KPIs | Total accident rows, noise rows, percentage | These values cannot be computed by summing hotspot rows because noise rows are excluded | Show unavailable-data states |
| Individual accident records | Data Insights | Date, hour, road type, weather, traffic signal, cause, severity | Trend, factor, weather, and hourly charts cannot be live | Preserve panel layout with explanatory unavailable states |
| City summary | Dashboard, City Analysis | City totals, clustered records, noise records | City-wide totals cannot be claimed from hotspot aggregates | Use clearly labelled clustered-hotspot aggregates |
| Date/filter query API | Map, Records, City Analysis, Data Insights | Date range and filter dimensions | Current hotspot summaries have no dates or filterable accident attributes | Client-side city/cluster/risk filtering only |
| Severity distribution | Dashboard | Severity counts by category | `Hotspot` only exposes fatal count, not serious/minor totals | Show unavailable state |

If these APIs are added later, the frontend can consume them without changing the existing page structure.
