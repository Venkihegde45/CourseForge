@echo off
echo 🚀 Starting CourseForge MERN Stack...

REM Start backend
echo 📦 Starting backend server...
cd server
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
start "CourseForge Backend" cmd /k "npm run dev"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend server...
cd ..\client
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "CourseForge Frontend" cmd /k "npm run dev"

echo.
echo ✅ Servers started!
echo 📡 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Close the command windows to stop servers

pause






