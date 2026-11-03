# AI-Based Accident Hotspot Identification — Master Project Status

> **Purpose of this file:** Single source of truth for project progress, environment setup, commands, database details, API URLs, troubleshooting, and the exact next steps. Update this file whenever a meaningful implementation or verification step changes.
>
> **Last updated:** 2026-10-17 (IST)  
> **Project status:** Core ML → MySQL → Spring Boot API pipeline verified; frontend and final end-to-end checks remain.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Status at a Glance](#2-current-status-at-a-glance)
3. [Architecture and Data Flow](#3-architecture-and-data-flow)
4. [Machine and Software Environment](#4-machine-and-software-environment)
5. [Project Paths and Important Files](#5-project-paths-and-important-files)
6. [Python and DBSCAN Implementation](#6-python-and-dbscan-implementation)
7. [Python Dependencies and Verification](#7-python-dependencies-and-verification)
8. [MySQL Database](#8-mysql-database)
9. [Python-to-MySQL Integration](#9-python-to-mysql-integration)
10. [One-Command Pipeline](#10-one-command-pipeline)
11. [Spring Boot Backend](#11-spring-boot-backend)
12. [Localhost APIs and Verification](#12-localhost-apis-and-verification)
13. [Commands to Run the Project](#13-commands-to-run-the-project)
14. [Troubleshooting History](#14-troubleshooting-history)
15. [Security and Data-Quality Notes](#15-security-and-data-quality-notes)
16. [Remaining Work](#16-remaining-work)
17. [How to Resume in a New Session](#17-how-to-resume-in-a-new-session)
18. [Handover Checklist](#18-handover-checklist)
19. [Prior Status File Notes](#19-prior-status-file-notes)

---

## 1. Project Overview

**Project name:** AI-Based Accident Hotspot Identification

**Objective:** Identify geographic accident hotspots from accident records using DBSCAN clustering, save the computed results in MySQL, and expose hotspot information through a Spring Boot REST API for a React frontend.

**Main technologies:**

- Python
- pandas, NumPy, scikit-learn DBSCAN
- MySQL 8.0
- `mysql-connector-python`
- Java / Spring Boot / Spring Data JPA / Hibernate
- Maven
- React frontend (its current completion status must be checked in the actual workspace)

**Current verified milestone:** Python reads the accident data from MySQL, runs city-wise DBSCAN, updates clustering fields and hotspot summary records, and produces CSV outputs. A Spring Boot backend has started successfully and both health and hotspot APIs have been verified in the browser. A batch file runs the Python pipeline with one command and prompts for the MySQL password.

**Important limitation:** The dataset's real-world provenance has not been independently verified. Treat the output as an exploratory academic prototype, not as validated real-world accident prediction or safety advice.

---

## 2. Current Status at a Glance

| Component | Status | Evidence / notes |
|---|---|---|
| CSV-based DBSCAN | **VERIFIED** | Original `run_dbscan.py` processes the CSV and produces CSV/map outputs. |
| Python MySQL connector | **VERIFIED** | Package installed and import successful. |
| Python reads MySQL accidents | **VERIFIED** | `run_dbscan_mysql.py` loaded 20,000 rows. |
| City-wise DBSCAN | **VERIFIED** | A recorded run produced 246 clusters and 10,543 noise records. |
| MySQL accident clustering update | **VERIFIED** | Successful run reported 20,000 accident rows processed. |
| MySQL hotspot summary update | **VERIFIED** | Successful run reported 246 hotspot rows saved. |
| Generated MySQL-pipeline CSVs | **VERIFIED** | Two `*_mysql.csv` outputs were generated. |
| One-command batch workflow | **VERIFIED** | `.\run_pipeline.bat` completed successfully. Password still entered manually. |
| Spring Boot backend | **VERIFIED AT LAST RUN** | Startup log showed Tomcat port 8080 and `Started AccidentHotspotApplication`. |
| Health API | **VERIFIED** | `/api/health` returned status `UP`. |
| Hotspots API | **VERIFIED** | `/api/hotspots` returned hotspot JSON records. |
| Hotspot uniqueness check | **VERIFIED AT CHECK TIME** | 246 total rows and 246 unique `(city, cluster_id)` combinations. |
| Frontend UI and integration | **PENDING / MUST INSPECT** | Do not assume frontend is complete without inspecting and running it. |
| End-to-end frontend → API → DB test | **PENDING** | Must verify in the actual browser/UI. |
| Secure credential cleanup | **PENDING** | A MySQL root password was accidentally typed in chat. Rotate it and use safer local configuration. |
| Data provenance validation | **PENDING** | Determine whether the dataset is real, synthetic, or mixed. |
| Scheduled/on-new-record automation | **OPTIONAL / NOT IMPLEMENTED** | Current automation is manually triggered with a batch file; it is not a scheduler or event trigger. |

---

## 3. Architecture and Data Flow

### Current data flow

```text
indian_roads_dataset.csv
        |
        v
Original CSV-based DBSCAN script
        |
        +--> CSV summaries and HTML map

MySQL accident_hotspot_db
        |
        v
run_dbscan_mysql.py
        |
        +--> Reads accident rows from MySQL
        +--> Validates coordinate/numeric fields
        +--> Runs city-wise DBSCAN
        +--> Updates accidents.cluster_id and accidents.is_hotspot
        +--> Refreshes hotspot summary rows in hotspots
        +--> Writes MySQL-pipeline CSV outputs
        |
        v
MySQL: accidents + hotspots
        |
        v
Spring Boot REST API (port 8080)
        |
        v
React frontend (remaining or needs verification)
```

### What the current automation does

`run_pipeline.bat` manually starts `run_dbscan_mysql.py`. The user enters the MySQL password in the terminal. The pipeline then recalculates clustering, updates the database, and creates CSV outputs.

### What it does NOT currently do

- It does not run automatically every day.
- It does not automatically trigger when a new accident is inserted.
- It does not automatically start Spring Boot.
- Do not assume that the MySQL workflow regenerates `output/hotspot_map.html`; inspect the script before making that claim. The MySQL version currently documents creation of `accidents_with_clusters_mysql.csv` and `hotspot_summary_mysql.csv`.

---

## 4. Machine and Software Environment

| Component | Recorded version / detail | Status |
|---|---|---|
| OS | Windows 11 | User-provided |
| Laptop | HP Omen | User-provided |
| CPU | 13th-generation Intel CPU | User-provided |
| RAM | 16 GB | User-provided |
| Storage | 1 TB | User-provided |
| GPU | NVIDIA GeForce RTX 4050, 6 GB VRAM | User-provided |
| Python | 3.14.7 | Verified in PowerShell |
| Java | 25.0.1 | Verified in PowerShell |
| Maven | 3.10.0 | Verified using full path |
| MySQL Server/client | 8.0.46 | Recorded/verified in setup |
| Ollama | 0.40.4 | Previously verified; not a dependency of this project pipeline |

### Exact project root

```text
C:\WD\A Project\5th sem minor project\Accident hotsport
```

### Important executable paths

MySQL client:

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
```

Maven:

```text
C:\Tools\apache-maven-3.10.0\bin\mvn.cmd
```

Python is available through `python` in the project's PowerShell terminal. The previously verified executable path was:

```text
C:\Users\HP\AppData\Local\Programs\Python\Python314\python.exe
```

---

## 5. Project Paths and Important Files

The following paths are based on project history and prior workspace inspection. **If a future developer needs to change or run a file, confirm that it still exists in the current workspace.**

### Project root

```text
C:\WD\A Project\5th sem minor project\Accident hotsport
```

| File/folder | Purpose |
|---|---|
| `PROJECT_STATUS.md` | This master handover and progress document. |
| `run_dbscan.py` | Original CSV-based DBSCAN workflow. |
| `run_dbscan_backup.py` | Backup copy of the original DBSCAN script. |
| `run_dbscan_mysql.py` | MySQL-connected DBSCAN workflow. |
| `run_pipeline.bat` | One-command manual pipeline launcher. |
| `test_dbscan_params.py` | DBSCAN parameter experimentation. |
| `indian_roads_dataset.csv` | Original accident input dataset. |
| `output/` | Generated pipeline outputs. |
| `output/test_mysql_connection.py` | Python-to-MySQL connection/count test. |
| `backend/` | Spring Boot backend project. |

### Original CSV-pipeline outputs

```text
output/accidents_with_clusters.csv
output/hotspot_summary.csv
output/city_summary.csv
output/hotspot_map.html
```

Historical/root-level copies were also mentioned in earlier project documentation:

```text
accidents_with_clusters.csv
city_summary.csv
hotspot_summary.csv
hotspot_map.html
```

Check whether these root-level copies still exist before relying on them.

### MySQL-pipeline outputs

```text
output/accidents_with_clusters_mysql.csv
output/hotspot_summary_mysql.csv
```

### Backend files

Prior inspection identified the following backend components; check the actual folder if a file needs editing:

```text
backend/
  pom.xml
  README (if present)
  src/main/java/com/accidenthotspot/backend/
    AccidentHotspotApplication.java
    entity/Accident.java
    entity/Hotspot.java
    repository/HotspotRepository.java
    service/HotspotService.java
    controller/HealthController.java
    controller/HotspotController.java
    exception/ApiExceptionHandler.java
  src/main/resources/application.properties
```

The actual source tree may differ slightly. Inspect it rather than assuming every listed path is present.

---

## 6. Python and DBSCAN Implementation

### DBSCAN parameters

| Parameter | Current value |
|---|---:|
| Earth radius | `6371.0088` km |
| `EPS_KM` | `1.0` |
| `MIN_SAMPLES` | `10` |
| Distance metric | `haversine` |
| Algorithm | `ball_tree` |
| Clustering scope | Separate DBSCAN run for each city |

### Original CSV-based script

`run_dbscan.py` reads `indian_roads_dataset.csv` by default, checks required fields, validates coordinates, clusters records city by city, and creates summary outputs and an HTML map.

Typical command from the project root:

```powershell
python run_dbscan.py
```

Optional input path:

```powershell
python run_dbscan.py indian_roads_dataset.csv
```

Expected original output paths:

```text
output/accidents_with_clusters.csv
output/hotspot_summary.csv
output/city_summary.csv
output/hotspot_map.html
```

The HTML map can be opened in a browser by opening the local file. It may need internet access for its external map tiles. The source script uses a MapTiler URL/key; review key restrictions and usage before distributing the project. Do not copy the key into public documentation or commit history.

### MySQL-connected script

`run_dbscan_mysql.py` currently performs the following, as verified by a successful run:

1. Connects to database `accident_hotspot_db`.
2. Reads `accident_id`, `city`, `latitude`, `longitude`, `accident_severity`, `casualties`, and `risk_score` from `accidents`.
3. Converts numeric fields and removes invalid/missing coordinates.
4. Runs DBSCAN separately for each city.
5. Assigns cluster IDs and marks `is_hotspot`.
6. Writes:
   - `output/accidents_with_clusters_mysql.csv`
   - `output/hotspot_summary_mysql.csv`
7. Updates the `accidents` table's `cluster_id` and `is_hotspot` fields.
8. Refreshes the `hotspots` summary table.
9. Commits successful changes; the script includes rollback handling on errors.

**Before future code changes:** inspect the current version of `run_dbscan_mysql.py`. Do not replace or restructure it without preserving its working behavior and backup.

### Last verified MySQL DBSCAN run

Command:

```powershell
python run_dbscan_mysql.py
```

Successful output:

```text
Loaded 20,000 records from MySQL
MySQL update successful!
Accident rows processed: 20,000
Hotspot rows saved: 246
CSV outputs saved in output/
```

A prior successful clustering calculation reported:

```text
Clusters found: 246
Noise records: 10,543
```

This implies 9,457 clustered records for that run (`20,000 - 10,543`). Later SQL verification reported 9,457 records with `is_hotspot=1`. These are observed results from the recorded dataset/run, not guaranteed counts for future data.

### Example hotspot summary output

A verified output included these columns:

```text
city,cluster_id,accident_count,latitude,longitude,fatal_records,total_casualties,avg_risk_score
```

Example record:

```text
Chandigarh,24,2577,30.698616,76.801333,378,4377,0.441618
```

Other clusters have smaller counts. Do not assume the first summary row is a separate independent cluster for every city; it is the largest cluster in the sorted output.

### Exploratory limitations

- Dataset provenance has not been independently verified.
- Cluster output depends on the data and DBSCAN parameters.
- A dense cluster is a geographic grouping, not proof of causal risk.
- Do not present the results as validated real-world predictions until the dataset and methodology are independently validated.

---

## 7. Python Dependencies and Verification

### Verified package versions

| Package | Recorded version | Verification |
|---|---|---|
| `mysql-connector-python` | `26.7.0` | `pip show` and import succeeded |
| `scikit-learn` | `1.9.1` | Version command succeeded |
| `pandas` | `3.0.6` | Version command succeeded |
| `numpy` | `2.5.2` | Version command succeeded |

The original CSV script also imports `folium`. Inspect package availability before installing anything; do not install all dependencies again without checking.

### Verify MySQL connector

```powershell
python -m pip show mysql-connector-python
python -c "import mysql.connector; print('MySQL connector import successful')"
```

### Verify ML packages

```powershell
python -c "import sklearn, pandas, numpy; print('sklearn:', sklearn.__version__); print('pandas:', pandas.__version__); print('numpy:', numpy.__version__)"
```

### Test Python-to-MySQL connection

The test file is located at:

```text
output/test_mysql_connection.py
```

Run from the project root:

```powershell
python output\test_mysql_connection.py
```

The script prompts for the MySQL password and checks the accident row count. A successful historical output was:

```text
MySQL connection successful!
Accident records: 20000
```

Type the password at the terminal prompt. It should never be pasted into chat, written into source code, or committed to a repository.

### pandas warning

A previous run displayed a warning that pandas does not officially test a raw MySQL Connector/Python DBAPI connection passed directly to `pd.read_sql()`. The script still completed successfully. The warning is not evidence of a failed run. A future cleanup could use SQLAlchemy or a cursor-to-DataFrame approach, but this is optional unless the warning causes an actual issue.

---

## 8. MySQL Database

### Database connection details

| Setting | Value |
|---|---|
| Database | `accident_hotspot_db` |
| Host | `localhost` |
| Port | `3306` |
| Username used in prior local tests | `root` |
| Password | **Never store in this file** |

MySQL client:

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
```

### Correct PowerShell command syntax

Because the executable path contains spaces, use the PowerShell call operator `&` and quotes:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p accident_hotspot_db
```

Do not run the path unquoted. That caused PowerShell to interpret `C:\Program` as a separate command.

### Tables and row counts

| Table | Verified row count | Purpose |
|---|---:|---|
| `accidents` | 20,000 | Individual accident records, features, and clustering fields |
| `hotspots` | 246 | Summary of DBSCAN hotspot clusters |
| `hotspots_backup_before_ml` | 246 at backup verification | Snapshot made before the MySQL ML update |

Counts are verified at the time recorded. Re-check them after new data or code changes.

### `accidents` table

The verified schema was described as 26 columns. Important fields:

- `accident_id`
- `city`
- `state`
- `latitude`
- `longitude`
- `accident_date`
- `accident_time`
- `hour`
- `day_of_week`
- `is_weekend`
- `road_type`
- `lanes`
- `traffic_signal`
- `weather`
- `visibility`
- `temperature`
- `traffic_density`
- `cause`
- `accident_severity`
- `vehicles_involved`
- `casualties`
- `is_peak_hour`
- `festival`
- `risk_score`
- `cluster_id`
- `is_hotspot`

The exact SQL types and constraints should be checked using a credentialed local connection before changing entity mappings or writing migration SQL.

### `hotspots` table

The verified schema has 9 columns:

- `id` — auto-increment primary key
- `city`
- `cluster_id`
- `accident_count`
- `latitude`
- `longitude`
- `fatal_records`
- `total_casualties`
- `avg_risk_score`

The table has a unique key on `(city, cluster_id)` according to the recorded schema. The Java entity maps generated `id` separately from `cluster_id`.

### Hotspot backup

Before the first successful Python write to MySQL, this backup table was created:

```sql
CREATE TABLE hotspots_backup_before_ml AS
SELECT * FROM hotspots;
```

Verification output:

```text
backup_rows = 246
```

This is a copy of the table's rows and columns, not a tested full database restore plan. Do not drop it until the user explicitly agrees and a suitable backup/restore plan exists.

### Verify counts

Run from PowerShell:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p accident_hotspot_db -e "SELECT COUNT(*) AS accident_rows FROM accidents; SELECT COUNT(*) AS hotspot_rows FROM hotspots; SELECT COUNT(*) AS marked_hotspots FROM accidents WHERE is_hotspot=1;"
```

Recorded output after a successful DBSCAN run:

- `accident_rows`: `20000`
- `hotspot_rows`: `246`
- `marked_hotspots`: `9457`

### Verify unique hotspot keys

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p accident_hotspot_db -e "SELECT COUNT(*) AS total_hotspots, COUNT(DISTINCT CONCAT(city, '-', cluster_id)) AS unique_hotspots FROM hotspots;"
```

Recorded result:

```text
total_hotspots  = 246
unique_hotspots = 246
```

This confirmed no duplicate `(city, cluster_id)` combinations at the time of the check.

---

## 9. Python-to-MySQL Integration

### Implementation history

1. The original DBSCAN script read the CSV file and generated cluster outputs.
2. `mysql-connector-python` was installed after an initial download timeout and then successfully verified.
3. `output/test_mysql_connection.py` confirmed a Python connection and 20,000 accident rows.
4. `run_dbscan_mysql.py` was created in the project root.
5. Its first version read sample records from MySQL.
6. The next version read all accident rows, ran DBSCAN, and wrote MySQL-specific CSV outputs without changing database tables.
7. A later version was updated to write clustering fields back to `accidents` and refresh the `hotspots` table.
8. The first write attempt failed with `Transaction already in progress`.
9. After removing the explicit `connection.start_transaction()` line, a later run succeeded and reported 20,000 accident rows processed and 246 hotspot rows saved.
10. The resulting database counts and uniqueness check were verified.

### Important safety behavior

- The `hotspots` table is refreshed by the current Python script; inspect the actual script before changing this behavior.
- The script also updates `cluster_id` and `is_hotspot` in the `accidents` table.
- A backup of `hotspots` exists as `hotspots_backup_before_ml`.
- Never run destructive SQL or replace the script without understanding its database-write behavior.
- The successful script run is the source of the last recorded verified ML/database update.

---

## 10. One-Command Pipeline

### File

```text
run_pipeline.bat
```

Location: project root.

Verified contents:

```bat
@echo off
cd /d "%~dp0"
python run_dbscan_mysql.py
echo.
echo Pipeline finished. Check the output above.
pause
```

### Run it

From the project root in PowerShell:

```powershell
.\run_pipeline.bat
```

The script changes the current directory to the batch file's directory, invokes the MySQL-connected Python pipeline, prints a final message, and waits for a keypress. The MySQL password is still entered manually when the Python script prompts for it.

### Last verified output

```text
MySQL password:
Loaded 20,000 records from MySQL
MySQL update successful!
Accident rows processed: 20,000
Hotspot rows saved: 246
CSV outputs saved in output/

Pipeline finished. Check the output above.
Press any key to continue . . .
```

### Automation status

**VERIFIED:** One-command manual-trigger pipeline.

**NOT IMPLEMENTED:** Daily scheduled run, automatic trigger on insert, or automatic Spring Boot launch. Those are optional future enhancements, not part of the current verified implementation.

---

## 11. Spring Boot Backend

### Backend path

```text
C:\WD\A Project\5th sem minor project\Accident hotsport\backend
```

### Recorded technology versions

| Component | Version |
|---|---|
| Spring Boot | `3.5.6` |
| Spring Framework | `6.2.11` |
| Hibernate ORM | `6.6.29.Final` |
| Java installed | `25.0.1` |
| Maven | `3.10.0` |
| Java compilation target | `21` |

### Backend structure recorded during setup

The backend package root is:

```text
com.accidenthotspot.backend
```

Components previously identified:

- `AccidentHotspotApplication` — Spring Boot entry point.
- `entity.Accident` — JPA mapping for the `accidents` table.
- `entity.Hotspot` — JPA mapping for the `hotspots` table.
- `repository.HotspotRepository` — Spring Data repository.
- `service.HotspotService` — hotspot retrieval service.
- `controller.HealthController` — health API.
- `controller.HotspotController` — hotspot API.
- `exception.ApiExceptionHandler` — API exception handling.

Inspect the actual `backend/src` tree before editing any file; names and implementation details must be taken from the current workspace.

### Application configuration

The recorded configuration was:

```properties
spring.application.name=accident-hotspot-backend
server.port=8080
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
spring.jpa.show-sql=false
spring.sql.init.mode=never
```

Check `backend/src/main/resources/application.properties` for the current actual values before changing anything.

`spring.jpa.hibernate.ddl-auto=validate` means Hibernate validates mappings against the database schema instead of creating or updating the schema.

### Environment variables

The backend requires:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Expected JDBC URL:

```text
jdbc:mysql://localhost:3306/accident_hotspot_db
```

These variables must exist in the PowerShell session that starts Spring Boot. A new terminal does not necessarily inherit variables set only in a previous terminal.

**Safe setup for the current PowerShell session:**

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/accident_hotspot_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = Read-Host "Enter MySQL root password"
```

Do not put the actual password into a command literal, source file, Markdown document, screenshot, or chat. `Read-Host` without `-AsSecureString` displays the typed characters in the terminal; for a safer long-term setup, use an appropriate local secret manager or a protected environment configuration. Do not ask the user to send secrets in chat.

Verify only whether the variables are set, without printing the password:

```powershell
Write-Host "DB_URL set:" ([bool]$env:DB_URL)
Write-Host "DB_USERNAME set:" ([bool]$env:DB_USERNAME)
Write-Host "DB_PASSWORD set:" ([bool]$env:DB_PASSWORD)
```

Expected: all `True`.

### Start the backend

Open a separate PowerShell terminal and navigate to the backend directory:

```powershell
cd "C:\WD\A Project\5th sem minor project\Accident hotsport\backend"
```

Set the environment variables in that same terminal, then run:

```powershell
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run
```

Keep this terminal open while using the APIs. Closing it or stopping the process makes the localhost endpoints unavailable.

### Build/test status

Prior Maven commands succeeded, including `clean verify`. However, the recorded build reported **no test classes to run**. This verifies compilation/package lifecycle success, not comprehensive automated test coverage.

### Startup error resolved

A previous backend startup failed with Hibernate's:

```text
Unable to determine Dialect without JDBC metadata
```

At the time, all three DB environment variables were unset. After setting them in the terminal and starting Maven again, the application successfully started and Hibernate/JPA initialized.

---

## 12. Localhost APIs and Verification

The backend was started successfully on port `8080`.

### 12.1 Health API

**URL:**

```text
http://localhost:8080/api/health
```

**Method:** `GET`

**Verified response:**

```json
{
  "status": "UP",
  "service": "accident-hotspot-backend"
}
```

**Status:** VERIFIED in browser after successful backend startup.

### 12.2 Hotspots API

**URL:**

```text
http://localhost:8080/api/hotspots
```

**Method:** `GET`

**Verified behavior:** The browser displayed a JSON array of hotspot records.

Fields observed in the response included:

- `id`
- `city`
- `clusterId`
- `accidentCount`
- `latitude`
- `longitude`
- `fatalRecords`
- `totalCasualties`
- `avgRiskScore`

**Status:** VERIFIED in browser after successful backend startup.

A screenshot showed records with IDs beginning at `256`. Later database verification confirmed 246 total hotspot rows and 246 unique `(city, cluster_id)` combinations. The numeric IDs are generated database IDs and do not have to start at 1 after a table refresh. If the IDs are important to the UI, verify the current schema and query results before assuming a problem.

### Important localhost note

These URLs work only when the backend is running on the current computer. A browser `ERR_CONNECTION_REFUSED` occurred earlier when the backend was stopped or failed to start. The backend was subsequently started successfully and both endpoints were verified.

Browser URL parameters such as `utm_source=chatgpt.com` are not required. Use the clean URLs above.

---

## 13. Commands to Run the Project

### A. Run the Python/MySQL pipeline

Open PowerShell in the project root:

```powershell
cd "C:\WD\A Project\5th sem minor project\Accident hotsport"
```

Run directly:

```powershell
python run_dbscan_mysql.py
```

Or use the batch file:

```powershell
.\run_pipeline.bat
```

Enter the MySQL password when prompted. A successful run should report 20,000 records loaded/processed and 246 hotspot rows saved for the current dataset.

### B. Start the backend

Use a **separate terminal**:

```powershell
cd "C:\WD\A Project\5th sem minor project\Accident hotsport\backend"
```

Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in this same terminal, then run:

```powershell
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run
```

Wait for the successful startup message. Leave the terminal running.

### C. Open the APIs

Health:

```text
http://localhost:8080/api/health
```

Hotspots:

```text
http://localhost:8080/api/hotspots
```

### D. Verify database counts

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p accident_hotspot_db -e "SELECT COUNT(*) AS accident_rows FROM accidents; SELECT COUNT(*) AS hotspot_rows FROM hotspots;"
```

### E. Open the generated map

If the file exists, open:

```text
C:\WD\A Project\5th sem minor project\Accident hotsport\output\hotspot_map.html
```

Note: the MySQL-connected pipeline's current verified output includes two `*_mysql.csv` files. Confirm that the HTML map has been regenerated after any database/ML changes before treating it as current.

---

## 14. Troubleshooting History

| Problem | Cause | Resolution / current status |
|---|---|---|
| `Package(s) not found: mysql-connector-python` | Connector package not installed yet | Installed `mysql-connector-python==26.7.0`; import verified. |
| pip download timeout | Network response timed out during download | Retried with increased timeout/retries; installation succeeded. |
| Python code pasted directly into PowerShell | PowerShell tried to parse Python syntax | Save code in a `.py` file, then run with `python filename.py`. |
| `KeyboardInterrupt` at password prompt | Prompt was interrupted with Ctrl+C | Rerun the script and enter the password. |
| MySQL error 1045 / access denied | Incorrect or empty password in a given attempt | Correct password was later entered; Python connection test succeeded. |
| `C:\Program` not recognized | Executable path contained spaces and was unquoted | Use `& "C:\Program Files\...\mysql.exe" ...` in PowerShell. |
| Python script not found under `backend` | The script is in the project root, not the backend folder | Run `cd ..` or open a terminal in the project root. |
| `Transaction already in progress` | An earlier version explicitly started a transaction while one was already active | Removed explicit `connection.start_transaction()`; a later run succeeded. Inspect current code before changing transaction behavior again. |
| Backend `ERR_CONNECTION_REFUSED` | Backend was not running or had failed to start | Backend was later started successfully; APIs verified. |
| Hibernate could not determine dialect | `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` were unset in the new terminal | Set all three variables in the same terminal before starting Maven. |
| pandas SQL connection warning | pandas warned that a raw MySQL connector connection is not its primary tested interface | Pipeline still completed. No confirmed fix recorded; optional cleanup. |
| Hotspot table row IDs appeared to start at 256 | Auto-increment IDs continued across table refreshes | Current uniqueness check returned 246 total and 246 unique hotspot keys. No duplicate key issue was found at that check. |

### Important PowerShell reminders

- Use `&` for a quoted executable path with spaces.
- `cd ..` moves from `backend` to the project root.
- Python code belongs in `.py` files, not directly in PowerShell.
- Password prompts may not show typed characters depending on the prompt method.
- Do not paste passwords into chat.

---

## 15. Security and Data-Quality Notes

### Password exposure

A MySQL root password was accidentally typed into chat during troubleshooting. Treat it as exposed and **rotate the MySQL root password**. Afterward, prefer creating a dedicated least-privilege database user for this application instead of using `root`.

Do not record the exposed password in this document. Do not hardcode passwords into Python, Java, `.bat`, or committed configuration files.

The current Python workflow asks for a password interactively. The Spring Boot backend reads credentials from environment variables.

### External map tile key

The original `run_dbscan.py` contains a MapTiler tile URL with a key. Review its restrictions and avoid committing a usable key to a public repository. Do not copy the literal key into this document.

### Data provenance

The dataset is named `indian_roads_dataset.csv`, and it contains 20,000 rows across eight cities according to earlier project checks. Its real-world authenticity has not been independently verified. Clearly label results as exploratory until provenance, collection method, date range, duplicates, coordinate quality, and severity labels are validated.

### Model limitations

- DBSCAN finds geographic density clusters; it does not establish accident causality.
- `EPS_KM = 1.0` and `MIN_SAMPLES = 10` are modeling choices and should be justified and tested.
- Results can change if input records or parameters change.
- A `risk_score` column in the input is not automatically a calibrated probability of future accidents.
- Do not claim that the model predicts future accidents unless a separate, validated predictive methodology is implemented.

---

## 16. Remaining Work

### Required next tasks

- [ ] **Frontend status check:** Inspect the existing React project and identify what is already implemented before creating or replacing files.
- [ ] **Frontend integration:** Connect the dashboard/map/summary views to `http://localhost:8080/api/hotspots`.
- [ ] **End-to-end testing:** Verify the complete flow from Python pipeline → MySQL → Spring Boot API → React UI.
- [ ] **Security cleanup:** Rotate the exposed MySQL root password and use a dedicated database user if practical.
- [ ] **Data-quality review:** Verify the source and provenance of the dataset and document its limitations.
- [ ] **Final UI/API checks:** Test loading states, empty results, errors, city filtering, and hotspot display if those features are part of the UI.

### Optional improvements

- [ ] Add automated tests for the backend and Python workflow.
- [ ] Improve the pandas/MySQL connection approach if the warning becomes an issue.
- [ ] Add a scheduled task or event-driven workflow if the user wants automatic execution. The current `.bat` is manual-trigger automation only.
- [ ] Add logging and a clear non-zero exit code when the pipeline fails, if not already implemented.
- [ ] Regenerate the HTML map from the current MySQL results if the map is intended to reflect the latest clustering.
- [ ] Add a database restore procedure and validate it before deleting any backup.

---

## 17. How to Resume in a New Session

When resuming work, read this file first and inspect the actual files before making assumptions.

### Project root

```text
C:\WD\A Project\5th sem minor project\Accident hotsport
```

### First commands

```powershell
cd "C:\WD\A Project\5th sem minor project\Accident hotsport"
```

Run the current MySQL-connected ML workflow:

```powershell
python run_dbscan_mysql.py
```

Or:

```powershell
.\run_pipeline.bat
```

This prompts for the MySQL password and updates the database. Do not run it casually if the database has been changed or contains new production data; inspect the script's write behavior first.

### Start the backend in another terminal

```powershell
cd "C:\WD\A Project\5th sem minor project\Accident hotsport\backend"
```

Set the database environment variables locally, without printing or sharing the password:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/accident_hotspot_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = Read-Host "Enter MySQL root password"
```

Then start:

```powershell
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run
```

Keep that terminal open.

### Verified API URLs

- Health: `http://localhost:8080/api/health`
- Hotspots: `http://localhost:8080/api/hotspots`

### Last recorded data counts

- Accidents: 20,000
- Hotspots: 246
- Marked hotspot accident rows: 9,457 at the recorded check
- Unique city-cluster combinations: 246 at the recorded check

Re-check these counts before relying on them.

### Next recommended action

Inspect the current React frontend and decide whether to integrate existing components or build missing dashboard functionality. Then test the full flow from the Python pipeline through MySQL and Spring Boot to the frontend.

### Safety rules for future sessions

1. Never ask the user to paste passwords, API keys, or tokens into chat.
2. Never overwrite the original `run_dbscan.py` without a backup and explicit need.
3. Never drop, truncate, or replace database tables without checking the effect and obtaining approval.
4. Inspect current source files before editing them; the project may change after this document is written.
5. Keep this document updated with verified results and dates.
6. Do not mark frontend or end-to-end work complete without actual verification.
7. Distinguish exploratory clustering from validated real-world predictions.

---

## 18. Handover Checklist

Before ending a future work session, update this checklist:

- [ ] Record changed files and the reason for each change.
- [ ] Record the exact commands run and whether they succeeded.
- [ ] Record updated row counts and API results where relevant.
- [ ] Record any new errors and their actual resolutions.
- [ ] Confirm no credentials or secrets were written to source or documentation.
- [ ] Update the current status and next recommended task.
- [ ] Re-read `PROJECT_STATUS.md` to make sure it matches the actual project state.

---

## 19. Prior Status File Notes

The previously uploaded `PROJECT_STATUS.md` documented an earlier stage when the backend had been built and schema mappings corrected, but live database/API validation had not yet been performed by that work session. Since then, the user has locally configured database environment variables, successfully started the backend, verified both API URLs, connected the Python DBSCAN workflow to MySQL, updated database records, and tested `run_pipeline.bat`.

This master status incorporates those later user-reported results while preserving the distinction between the earlier backend-build evidence and the later local runtime verification. If a future inspection contradicts a detail, inspect the current source and runtime state, then update this document with the new verified result rather than silently retaining a stale claim.

---

**End of master project status.**
