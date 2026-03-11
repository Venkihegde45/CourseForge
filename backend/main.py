from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.config import settings
from app.core.database import engine, get_db, Base
from app.models import models
from app.api.endpoints import auth, courses, user

# Create all tables in the database
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database connection failed. Ensure PostgreSQL is running. Error: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend AI orchestration API for CourseForge Learning Platform",
    version="1.0.0"
)

# Allow React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Preferred 'app' structure
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(user.router, prefix="/api/user", tags=["user"])

# Include legacy routers if they exist (based on structure analysis)
try:
    from app.api.endpoints import uploads, tutor, progress
    app.include_router(uploads.router, prefix="/api/v1", tags=["uploads"])
    app.include_router(tutor.router, prefix="/api/v1", tags=["tutor"])
    app.include_router(progress.router, prefix="/api/v1", tags=["progress"])
    
    # Mount uploads directory for static file access
    os.makedirs("uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except ImportError:
    print("Warning: Some discovery-based routers could not be imported. Skipping legacy prefixes.")

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API", "version": "1.0.0"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Checks if the API is running and can connect to the database.
    """
    try:
        # Execute a simple query to test DB connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        # Fallback for when DB is not connected but API is alive
        return {"status": "partially_healthy", "database": "disconnected", "error": str(e)}

# This block allows you to run the server by simply executing `python main.py`
if __name__ == "__main__":
    import uvicorn
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
