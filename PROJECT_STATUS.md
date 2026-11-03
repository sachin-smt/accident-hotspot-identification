# Accident Hotspot Identification — Project Status

## Project Overview

**Objective:** Identify accident hotspots from the existing accident dataset using the completed Python DBSCAN processing and expose the persisted hotspot results to a future React frontend.

**Technologies:** Python/DBSCAN, Java 21 target, Spring Boot, Spring Web, Spring Data JPA, MySQL 8.0, Maven, and React (handled separately).

**Architecture:** Existing Python processing produces hotspot data. The new Spring Boot backend reads the existing MySQL database without modifying it and exposes health and read-only hotspot APIs. Frontend integration is intentionally deferred.

## Machine & Environment

| Component | Verified information |
|---|---|
| Operating system | Windows 11 (user-provided; not independently queried in this phase) |
| Java | `25.0.1` LTS, verified on 2026-10-17 |
| Maven | `mvn` not found in this agent terminal; verified fallback `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd` reports Maven 3.10.0 on 2026-10-17 |
| MySQL | MySQL 8.0 user-provided; MySQL client found at `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe` |
| Python | `3.14.7`, verified on 2026-10-17 |

The backend targets Java 21 for Spring Boot compatibility. Java 25 is not uninstalled or modified.

## Existing Project Files

- Python processing: `run_dbscan.py`, `run_dbscan_backup.py`
- Python test/parameter comparison: `test_dbscan_params.py`
- Input dataset: `indian_roads_dataset.csv`
- Root CSV outputs: `accidents_with_clusters.csv`, `city_summary.csv`, `hotspot_summary.csv`
- Root map output: `hotspot_map.html`
- Mirrored generated outputs: `output\accidents_with_clusters.csv`, `output\city_summary.csv`, `output\hotspot_summary.csv`, `output\hotspot_map.html`
- Existing documentation: `README.txt`, `RUN_SUMMARY.txt`

These files were inspected and were not modified in this phase.

## Database Details

- Database: `accident_hotspot_db` (user-provided)
- Tables: `accidents` (26 columns, 20,000 records) and `hotspots` (9 columns, 246 records)
- DBSCAN result: 246 distinct clusters, matching the reported `hotspots` row count.
- Evidence inspected before implementation:
  - Accident source/output fields include 24 source fields plus `cluster_id` and `is_hotspot`.
  - Hotspot summary fields are `city`, `cluster_id`, `accident_count`, `latitude`, `longitude`, `fatal_records`, `total_casualties`, and `avg_risk_score` (8 CSV fields).
- User-provided verified schema details now establish the exact 26 `accidents` columns and 9 `hotspots` columns, including SQL types, keys, and the auto-increment `hotspots.id`. The entity mappings were corrected to these details on 2026-10-17.
- Live `DESCRIBE`/`information_schema` inspection was attempted read-only on 2026-10-17, but MySQL rejected the connection because the client defaulted to user `ODBC` with no password. The entity mappings are therefore file-evidence-based, not runtime-confirmed.
- No database tables or records were changed.

## Backend Architecture

Status: **Schema-aligned and build-verified; runtime database validation not run**.

Planned package root: `com.accidenthotspot.backend`

- `AccidentHotspotApplication`: Spring Boot entry point.
- `entity.Accident`: read-only JPA mapping for all 26 verified `accidents` columns, including `accident_date`, `accident_time`, and DECIMAL fields.
- `entity.Hotspot`: read-only JPA mapping for all 9 verified `hotspots` columns, with generated `id` separate from `cluster_id`.
- `repository.HotspotRepository`: read-only Spring Data repository.
- `service.HotspotService`: hotspot retrieval service.
- `controller.HealthController`: health endpoint.
- `controller.HotspotController`: read-only hotspot endpoint.
- `exception.ApiExceptionHandler`: explicit API error responses.

## API Documentation

| Endpoint | Method | Purpose | Test status |
|---|---|---|---|
| `/api/health` | GET | Confirm the backend process is responding | Not yet run |
| `/api/hotspots` | GET | Retrieve hotspot records from MySQL, read-only | Not yet run; requires configured DB and schema validation |

Example request:

```text
GET http://localhost:8080/api/health
GET http://localhost:8080/api/hotspots
```

Expected health response:

```json
{"status":"UP","service":"accident-hotspot-backend"}
```

Expected hotspot response: a JSON array containing hotspot rows with `city`, `clusterId`, `accidentCount`, `latitude`, `longitude`, `fatalRecords`, `totalCasualties`, and `avgRiskScore`.

## Configuration

Required environment variables:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/accident_hotspot_db?useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "<your-mysql-username>"
$env:DB_PASSWORD = "<your-mysql-password>"
```

Values are supplied at process start and are never stored in this repository or printed by the application. `spring.jpa.hibernate.ddl-auto=validate` prevents schema creation or modification.

## Completed Tasks

- [x] Inspected the workspace without changing existing files (2026-10-17).
- [x] Inspected existing documentation, Python processing, and CSV headers (2026-10-17).
- [x] Obtained approval before creating files (2026-10-17).
- [x] Created the initial status document and backend source/configuration files (2026-10-17).
- [x] Compiled and packaged the backend with Maven 3.10.0 (2026-10-17).
- [x] Ran Maven clean test and verify successfully (2026-10-17).
- [x] Corrected JPA mappings against the user-provided verified MySQL schema (2026-10-17).
- [x] Rebuilt and verified the corrected backend with Maven (2026-10-17).

## Current Progress

- **Current phase:** Phase 1 — backend setup and database connection.
- **Latest successful step:** Corrected entity mappings compiled successfully under Java release 21, and `mvn.cmd clean verify` passed from `backend` on 2026-10-17.
- **Exact stopping point:** The schema mappings are aligned with the verified schema supplied in the task. No project test classes exist, and runtime API/schema validation was not run because database credentials are not available to this agent.

## Errors & Fixes

- **Error:** `mvn` was not recognized in this agent terminal on 2026-10-17.
  - **Cause:** This terminal's PATH differs from the user's newly opened PowerShell.
  - **Status:** Worked around without installing or changing settings by using the verified executable `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd`.
- **Error:** Initial Maven package invocation from the project root reported no POM.
  - **Cause:** The POM is intentionally in the `backend` subfolder.
  - **Status:** Resolved by running Maven from `backend`.
- **Error:** MySQL read-only schema/count query returned `ERROR 1045 (28000): Access denied for user 'ODBC'@'localhost' (using password: NO)`.
  - **Cause:** No credentials were supplied to the MySQL client; the client used its default ODBC username.
  - **Status:** Blocked pending credentials/environment configuration; no schema or data was changed.
- **Schema verification limitation:** No DB environment variables were set during setup, so live schema metadata could not be queried.
  - **Status:** Live validation remains pending. The mapping itself was finalized from the verified schema supplied by the user; no password or secret was requested or stored.
- **Mapping correction:** The prior entities used `date`/`time`, `Double` DECIMAL fields, and `cluster_id` as the hotspot primary key.
  - **Fix:** Mapped `accident_date`/`accident_time`, changed DECIMAL fields to `BigDecimal`, and mapped generated `hotspots.id` separately from `cluster_id`.
- **Hibernate validation correction:** MySQL reported `is_peak_hour` as `TINYINT` while Hibernate expected `BIT` for a Boolean field.
  - **Fix:** Added `columnDefinition = "TINYINT"` to the Boolean mappings for `is_weekend`, `traffic_signal`, `is_peak_hour`, and `is_hotspot`. The database schema and data were not changed.

## Testing Results

| Command/action | Expected result | Actual result |
|---|---|---|
| Workspace file inspection | Existing files identified | Passed; existing Python, CSV, HTML, and text files found |
| CSV header inspection | Determine mapping evidence | Passed; accident and hotspot output headers inspected |
| `java -version` | Report installed Java | Passed; Java 25.0.1 |
| `mvn -version` | Report Maven | Failed in this agent terminal; command not found |
| `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd -version` | Report verified Maven | Passed; Maven 3.10.0 with Java 25.0.1 |
| DB environment presence check | Avoid exposing secrets | Passed; no supported DB variables were set |
| Root `mvn -q -DskipTests package` | Compile/package backend | Failed; no POM in project root |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd -q -DskipTests package` | Compile/package backend | Passed; exit code 0 |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd -q test` | Run backend tests | Passed; exit code 0 (no project test classes currently present) |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd clean test` | Clean and test backend | Passed; exit code 0 |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd verify` | Run Maven verification lifecycle | Passed; exit code 0 |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd test` | Detailed test output | Passed; `BUILD SUCCESS`, `No tests to run`, total time 4.185 s |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd test` (2026-10-17 15:46) | Run available backend tests | Passed; `BUILD SUCCESS`, `No tests to run`, total time 12.078 s |
| Backend/entity-to-file comparison | Verify mappings from available project files | Partially passed; all 26 accident names and 8 hotspot names are evidenced, but hotspot ninth column and SQL metadata are unknown |
| Corrected entity inspection | Match verified schema details | Passed; all 26 accident and 9 hotspot columns are explicitly mapped with corrected Java types and key annotations |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd clean verify` | Compile, test, package, and repackage backend | Passed; `BUILD SUCCESS`, 8 source files compiled, no tests to run, total time 5.552 s |
| `backend`: `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd clean verify` (2026-10-17 16:21) | Verify TINYINT mapping correction | Passed; `BUILD SUCCESS`, 8 source files compiled, no tests to run, total time 5.495 s |
| MySQL `DESCRIBE`/count queries | Verify live schema and counts read-only | Blocked; MySQL authentication error for default `ODBC` user |
| `py --version` | Verify Python | Passed; Python 3.14.7 |
| Protected-file timestamp/size check | Confirm existing artifacts were not changed | Passed; existing Python, CSV, HTML, and text artifacts remain unchanged |
| MySQL client version | Confirm available client | Passed; MySQL 8.0.46 client found |
| API smoke tests | Verify endpoints and DB read | Not run; build and DB configuration pending |

## Pending Tasks & Next Steps

- [x] **High:** Build and test backend with the verified Maven executable (2026-10-17).
- [x] **High:** Align entity mappings with the verified MySQL schema supplied by the user (2026-10-17).
- [x] **High:** Correct Boolean/TINYINT Hibernate validation mappings (2026-10-17).
- [ ] **High:** Run live application/schema validation if credentials are already configured outside this agent session; do not request or store credentials.
- [ ] **High:** Configure DB environment variables locally without committing secrets, only if the user chooses to do so outside this agent session.
- [x] **High:** Run available Maven tests with the verified executable (2026-10-17).
- [ ] **High:** Start the backend and verify `/api/health` and `/api/hotspots`; runtime verification depends on local DB credentials and schema access.
- [ ] **Medium:** Adjust mappings only if a future live validation identifies differences.
- [ ] **Later:** Add frontend integration; explicitly out of scope for Phase 1.

## Run Instructions

From the project root:

```powershell
cd .\backend
$env:DB_URL = "jdbc:mysql://localhost:3306/accident_hotspot_db?useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "<your-mysql-username>"
$env:DB_PASSWORD = "<your-mysql-password>"
mvn spring-boot:run
```

In a second PowerShell window:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/hotspots
```

Do not substitute real credentials into committed files or command history intended for sharing.

## Important Rules

- Protect all existing Python scripts, CSV outputs, map files, and other project files.
- Never drop, recreate, truncate, or update the existing MySQL tables or records.
- Use environment variables for credentials; never hardcode or print passwords/API keys.
- Keep JPA schema management in validation-only mode.
- Record only verified results in this document, with the date of each meaningful update.
- Do not begin frontend integration during Phase 1.

**Last updated:** 2026-10-17 16:21 IST
