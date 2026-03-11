from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.security import get_current_user
from app.api.deps import get_db
from app.models.user import User
from app.models.course import Course, Topic, Module
from app.agents.mapper_agent import generate_knowledge_graph
from app.core.cache import knowledge_map_cache
from app.models.models import CourseProgress
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.get("/stats", response_model=UserSchema)
def get_user_stats(
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user's learning stats (XP, streaks, etc.)
    """
    return current_user

@router.get("/learning-summary")
def get_learning_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Calculates overall progress across all courses."""
    courses = db.query(Course).filter(Course.owner_id == current_user.id).all()
    if not courses:
        return {"total_progress": 0, "courses_completed": 0, "total_courses": 0}
    
    total_percentage = 0
    for course in courses:
        # Simple progress calculation: completed topics / total topics
        all_topics = db.query(Topic).join(Module).filter(Module.course_id == course.id).all()
        completed_topics = db.query(CourseProgress).filter(
            CourseProgress.user_id == current_user.id,
            CourseProgress.course_id == course.id
        ).first()
        
        num_completed = len(completed_topics.completed_topic_ids) if completed_topics and completed_topics.completed_topic_ids else 0
        if all_topics:
            total_percentage += (num_completed / len(all_topics)) * 100

    return {
        "total_progress": round(total_percentage / len(courses), 1),
        "courses_completed": sum(1 for c in courses if c.status == "completed"), # Placeholder status check
        "total_courses": len(courses)
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """Return top users by XP for the global leaderboard."""
    users = db.query(User).order_by(User.xp.desc()).limit(10).all()
    
    leaderboard = []
    for user in users:
        # Level calculation: floor(sqrt(XP / 100)) + 1
        level = int((user.xp / 100) ** 0.5) + 1
        leaderboard.append({
            "name": user.name,
            "xp": user.xp,
            "level": level,
            "streak": user.streak_days
        })
    return leaderboard

@router.get("/knowledge-map")
def get_knowledge_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generates a semantic knowledge graph of all user courses."""
    courses = db.query(Course).filter(Course.owner_id == current_user.id).all()
    
    course_list = [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category or "General"
        } for c in courses
    ]
    
    # Try cache first
    cache_key = f"km_{current_user.id}_{len(course_list)}"
    cached_graph = knowledge_map_cache.get(cache_key)
    if cached_graph:
        return cached_graph

    graph = generate_knowledge_graph(course_list)
    knowledge_map_cache.set(cache_key, graph)
    return graph
