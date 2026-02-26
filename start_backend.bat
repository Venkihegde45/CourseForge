@echo off
REM Quick start script for backend (Windows)

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\.installed" (
    echo Installing dependencies...
    pip install -r requirements.txt
    type nul > venv\.installed
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env and add your OPENAI_API_KEY
)

REM Create uploads directory
if not exist "uploads" mkdir uploads

REM Run the server
echo Starting backend server...
uvicorn main:app --reload --host 0.0.0.0 --port 8000






