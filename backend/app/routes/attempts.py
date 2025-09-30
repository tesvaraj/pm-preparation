from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from ..database import get_db
from ..models import Attempt, User, Question
from ..schemas import AttemptResponse
from ..dependencies import get_current_user
from ..services.transcription import transcribe_audio

router = APIRouter(prefix="/attempts", tags=["attempts"])

# Create uploads directory
UPLOAD_DIR = "uploads/audio"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=AttemptResponse, status_code=status.HTTP_201_CREATED)
async def create_attempt(
    question_id: int = Form(...),
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit an attempt with audio recording"""

    # Check if question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )

    # Save audio file
    file_extension = audio.filename.split('.')[-1] if '.' in audio.filename else 'webm'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        content = await audio.read()
        f.write(content)

    # Create attempt record
    new_attempt = Attempt(
        user_id=current_user.id,
        question_id=question_id,
        audio_url=file_path
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    # Transcribe audio asynchronously (in background for now)
    try:
        transcript = await transcribe_audio(file_path)
        new_attempt.transcript = transcript
        db.commit()
        db.refresh(new_attempt)
    except Exception as e:
        # Log error but don't fail the request
        print(f"Transcription error: {str(e)}")

    return new_attempt


@router.get("/", response_model=List[AttemptResponse])
def get_user_attempts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all attempts for the current user"""
    attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).all()
    return attempts


@router.get("/{attempt_id}", response_model=AttemptResponse)
def get_attempt(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific attempt"""
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )

    if attempt.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this attempt"
        )

    return attempt
