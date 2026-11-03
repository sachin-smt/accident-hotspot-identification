# Accident Hotspot Backend

This Spring Boot service reads the existing `accident_hotspot_db.hotspots` table and exposes it through a read-only API. It does not create, update, truncate, or delete database data.

## Requirements

- Java 21 or a compatible installed JDK. The project targets Java 21; the existing Java 25 installation is not changed.
- Maven.
- MySQL 8.0 with the existing `accident_hotspot_db` database.

## Configuration

Set these environment variables in the PowerShell process used to run the backend:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/accident_hotspot_db?useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "<your-mysql-username>"
$env:DB_PASSWORD = "<your-mysql-password>"
```

Do not commit these values or print the password. JPA is configured with `ddl-auto=validate`, and SQL initialization is disabled.

## Run

```powershell
mvn spring-boot:run
```

## API

```text
GET http://localhost:8080/api/health
GET http://localhost:8080/api/hotspots
```

The health endpoint returns a small service status object. The hotspot endpoint returns the rows read from `hotspots`.

## Verify

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/hotspots
```
