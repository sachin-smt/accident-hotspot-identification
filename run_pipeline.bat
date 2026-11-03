
@echo off
cd /d "%~dp0"
python run_dbscan_mysql.py
echo.
echo Pipeline finished. Check the output above.
pause
