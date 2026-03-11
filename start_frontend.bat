@echo off
REM Quick start script for frontend (Windows)

cd frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 > .env.local
)

REM Run the development server
echo Starting frontend server...
call npm run dev






