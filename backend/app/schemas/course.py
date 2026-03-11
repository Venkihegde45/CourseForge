from pydantic import BaseModel
from typing import List, Optional

class ChapterSchema(BaseModel):
    order: int
    title: str
    objective: str
    key_concepts: List[str]
    content_summary: str

class CourseGenerateRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "starter"  # starter, intermediate, advanced

class CourseGenerateResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    status: str
    chapters: List[ChapterSchema]

    class Config:
        from_attributes = True
