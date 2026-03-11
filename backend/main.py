from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, get_db, Base
from app.models import models
from app.api.endpoints import auth, courses

# Create all tables in the database (This will throw an error if Postgres isn't running, which we will handle)
# For production, we'll use Alembic migrations, but this is good for rapid prototyping
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
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])



@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API"}

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
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

# This block allows you to run the server by simply executing `python main.py`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
