from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..models import Attempt, User, Friendship
from ..schemas.friendship import LeaderboardEntry
from ..dependencies import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/global", response_model=List[LeaderboardEntry])
def get_global_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get global leaderboard of all users"""
    leaderboard = db.query(
        User.id.label("user_id"),
        User.username,
        func.avg(Attempt.score).label("average_score"),
        func.count(Attempt.id).label("total_attempts")
    ).join(
        Attempt, User.id == Attempt.user_id
    ).filter(
        Attempt.score.isnot(None)
    ).group_by(
        User.id, User.username
    ).order_by(
        func.avg(Attempt.score).desc()
    ).limit(limit).all()

    return [
        LeaderboardEntry(
            user_id=entry.user_id,
            username=entry.username,
            average_score=round(entry.average_score, 2),
            total_attempts=entry.total_attempts
        )
        for entry in leaderboard
    ]


@router.get("/friends", response_model=List[LeaderboardEntry])
def get_friends_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get leaderboard of friends only"""
    # Get friend IDs
    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) | (Friendship.friend_id == current_user.id)) &
        (Friendship.status == "accepted")
    ).all()

    friend_ids = [current_user.id]  # Include self
    for f in friendships:
        if f.user_id == current_user.id:
            friend_ids.append(f.friend_id)
        else:
            friend_ids.append(f.user_id)

    leaderboard = db.query(
        User.id.label("user_id"),
        User.username,
        func.avg(Attempt.score).label("average_score"),
        func.count(Attempt.id).label("total_attempts")
    ).join(
        Attempt, User.id == Attempt.user_id
    ).filter(
        User.id.in_(friend_ids),
        Attempt.score.isnot(None)
    ).group_by(
        User.id, User.username
    ).order_by(
        func.avg(Attempt.score).desc()
    ).all()

    return [
        LeaderboardEntry(
            user_id=entry.user_id,
            username=entry.username,
            average_score=round(entry.average_score, 2),
            total_attempts=entry.total_attempts
        )
        for entry in leaderboard
    ]
