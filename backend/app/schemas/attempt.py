from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class AttemptCreate(BaseModel):
    question_id: int


class AttemptResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    audio_url: Optional[str]
    transcript: Optional[str]
    score: Optional[float]
    feedback: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
