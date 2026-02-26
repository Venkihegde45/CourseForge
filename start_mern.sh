#!/bin/bash

echo "🚀 Starting CourseForge MERN Stack..."

# Start backend
echo "📦 Starting backend server..."
cd server
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../client
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait






