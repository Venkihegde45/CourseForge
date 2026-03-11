from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Text, JSON, Float
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
    progress = relationship("CourseProgress", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    source_type = Column(String, default="text")  # text, pdf, image
    status = Column(String, default="ready")      # planning, generating, ready
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.STARTER)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="course", cascade="all, delete-orphan")
    progress_entries = relationship("CourseProgress", back_populates="course", cascade="all, delete-orphan")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order = Column(Integer, default=0)
    title = Column(String)
    description = Column(Text, nullable=True)

    course = relationship("Course", back_populates="modules")
    topics = relationship("Topic", back_populates="module", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"))
    order = Column(Integer, default=0)
    title = Column(String)
    
    # Three levels of explanation
    beginner_content = Column(Text)
    intermediate_content = Column(Text)
    expert_content = Column(Text)
    
    examples = Column(JSON)  # List of strings
    analogies = Column(JSON) # List of strings
    summary = Column(Text)

    module = relationship("Module", back_populates="topics")
    quizzes = relationship("Quiz", back_populates="topic", cascade="all, delete-orphan")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    question = Column(Text)
    options = Column(JSON)      # List of strings
    correct_answer = Column(Integer) # Index
    explanation = Column(Text)
    difficulty = Column(String) # easy, medium, hard

    topic = relationship("Topic", back_populates="quizzes")

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    front = Column(Text)
    back = Column(Text)

    course = relationship("Course", back_populates="flashcards")

class CourseProgress(Base):
    __tablename__ = "course_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    completed_topic_ids = Column(JSON, default=list) # List of integer topic IDs
    quiz_scores = Column(JSON, default=dict)         # {topic_id: score}
    overall_percentage = Column(Float, default=0.0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="progress")
    course = relationship("Course", back_populates="progress_entries")
