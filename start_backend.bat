@echo off
cd /d "%~dp0BanckEnd"
echo ================================
echo Starting Backend (FastAPI)
echo ================================
echo.

REM Check if venv exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -q -r requirements.txt

REM Start backend
echo.
echo Backend running on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
