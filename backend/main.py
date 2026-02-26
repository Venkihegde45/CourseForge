"""
CourseForge Backend - Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from api import courses, uploads, tutor, progress
from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CourseForge API",
    description="AI-powered course generation platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(uploads.router, prefix="/api/v1", tags=["uploads"])
app.include_router(courses.router, prefix="/api/v1", tags=["courses"])
app.include_router(tutor.router, prefix="/api/v1", tags=["tutor"])
app.include_router(progress.router, prefix="/api/v1", tags=["progress"])

# Import and include export router
from api import export
app.include_router(export.router, prefix="/api/v1", tags=["export"])


@app.get("/")
async def root():
    return {"message": "CourseForge API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

