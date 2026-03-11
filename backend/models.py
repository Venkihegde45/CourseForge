"""
Database models for CourseForge
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    source_type = Column(String)  # text, pdf, image, audio, video, link
    source_content = Column(Text)  # For text inputs
    source_file_path = Column(String)  # For file uploads
    table_of_contents = Column(JSON)  # Structured TOC
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="course", cascade="all, delete-orphan")
    progress = relationship("CourseProgress", back_populates="course", cascade="all, delete-orphan")


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    
    # Three explanation levels
    beginner_content = Column(Text)
    intermediate_content = Column(Text)
    expert_content = Column(Text)
    
    # Additional content
    examples = Column(JSON)  # List of examples
    analogies = Column(JSON)  # List of analogies
    diagrams = Column(JSON)  # Diagram descriptions/URLs
    summary = Column(Text)
    
    # Optional coding tasks
    coding_tasks = Column(JSON)  # List of coding exercises
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    module = relationship("Module", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of answer options
    correct_answer = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson", back_populates="quizzes")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="flashcards")


class CourseProgress(Base):
    __tablename__ = "course_progress"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    user_id = Column(String)  # Simple user identifier (can be enhanced)
    current_module_id = Column(Integer, ForeignKey("modules.id"))
    current_lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed_lessons = Column(JSON, default=list)  # List of completed lesson IDs
    quiz_scores = Column(JSON, default=dict)  # {quiz_id: score}
    overall_progress = Column(Float, default=0.0)  # 0.0 to 1.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    course = relationship("Course", back_populates="progress")


class TutorConversation(Base):
    __tablename__ = "tutor_conversations"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    user_id = Column(String)
    messages = Column(JSON, default=list)  # List of {role: "user"/"assistant", content: "..."}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())






