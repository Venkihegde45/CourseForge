#!/bin/bash
# Quick start script for frontend

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
fi

# Run the development server
echo "Starting frontend server..."
npm run dev






