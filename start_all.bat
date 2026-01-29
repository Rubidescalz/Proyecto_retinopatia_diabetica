@echo off
echo ================================
echo System_RD - Local Development
echo ================================
echo.
echo Starting both Backend and Frontend...
echo.
echo 1. Backend (FastAPI) will open on: http://localhost:8000
echo 2. Frontend (React) will open on: http://localhost:5173
echo.
echo Press Ctrl+C in each terminal to stop the servers
echo.

REM Open backend
start cmd /k call start_backend.bat

REM Open frontend  
start cmd /k call start_frontend.bat

pause
