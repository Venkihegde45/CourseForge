from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class DifficultyLevel(str, enum.Enum):
    STARTER = "starter"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    
    courses = relationship("Course", back_populates="owner")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    source_type = Column(String, default="text")  # text, pdf, image
    status = Column(String, default="ready")  # planning, generating, ready
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.STARTER)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="courses")
    chapters = relationship("Chapter", back_populates="course", cascade="all, delete-orphan", order_by="Chapter.order")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order = Column(Integer, default=0)
    title = Column(String)
    objective = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True)  # stored as JSON string
    content_summary = Column(Text, nullable=True)

    course = relationship("Course", back_populates="chapters")
