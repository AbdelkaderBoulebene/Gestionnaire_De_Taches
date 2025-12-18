@echo off
chcp 65001
set PGCLIENTENCODING=UTF8
echo Execution du script de reinitialisation de la base de donnees...
echo.
set PGPASSWORD=root
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d gestionnaire_taches -f "%~dp0reset_database.sql"
echo.
echo Script execute avec succes!
pause
