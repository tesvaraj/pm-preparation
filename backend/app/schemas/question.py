from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class QuestionCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None


class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    creator_id: int
    title: str
    description: str
    category: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
