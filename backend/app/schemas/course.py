from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class QuizSchema(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: str

    class Config:
        from_attributes = True

class TopicSchema(BaseModel):
    id: int
    order: int
    title: str
    beginner_content: str
    intermediate_content: str
    expert_content: str
    examples: List[str]
    analogies: List[str]
    summary: str
    quizzes: List[QuizSchema] = []

    class Config:
        from_attributes = True

class ModuleSchema(BaseModel):
    id: Optional[int] = None
    order: int
    title: str
    description: str
    topics: List[TopicSchema]

    class Config:
        from_attributes = True

class CourseGenerateRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "starter"  # starter, intermediate, advanced

class CourseBase(BaseModel):
    title: str
    description: str
    difficulty: str
    source_type: str = "text"

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    status: str
    created_at: datetime
    modules: List[ModuleSchema] = []

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    completed_topic_ids: List[int]
    quiz_scores: Dict[int, int]
    overall_percentage: float

class ProgressResponse(ProgressUpdate):
    id: int
    user_id: int
    course_id: int
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
