@echo off
cd /d "%~dp0FrontEnd"
echo ================================
echo Starting Frontend (React + Vite)
echo ================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

REM Start frontend
echo.
echo Frontend running on: http://localhost:5173
echo.
call npm run dev

pause
