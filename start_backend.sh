#!/bin/bash
# Quick start script for backend

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env and add your OPENAI_API_KEY"
fi

# Create uploads directory
mkdir -p uploads

# Run the server
echo "Starting backend server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000






