from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Friendship, User
from ..schemas.friendship import FriendshipCreate, FriendshipResponse
from ..schemas.user import UserResponse
from ..dependencies import get_current_user

router = APIRouter(prefix="/friends", tags=["friends"])


@router.post("/request", response_model=FriendshipResponse, status_code=status.HTTP_201_CREATED)
def send_friend_request(
    friendship_data: FriendshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a friend request"""
    # Check if friend exists
    friend = db.query(User).filter(User.id == friendship_data.friend_id).first()
    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if already friends or request exists
    existing = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friendship_data.friend_id)) |
        ((Friendship.user_id == friendship_data.friend_id) & (Friendship.friend_id == current_user.id))
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Friend request already exists or you are already friends"
        )

    new_friendship = Friendship(
        user_id=current_user.id,
        friend_id=friendship_data.friend_id,
        status="pending"
    )
    db.add(new_friendship)
    db.commit()
    db.refresh(new_friendship)
    return new_friendship


@router.post("/{friendship_id}/accept", response_model=FriendshipResponse)
def accept_friend_request(
    friendship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept a friend request"""
    friendship = db.query(Friendship).filter(Friendship.id == friendship_id).first()
    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found"
        )

    if friendship.friend_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to accept this request"
        )

    friendship.status = "accepted"
    db.commit()
    db.refresh(friendship)
    return friendship


@router.get("/", response_model=List[UserResponse])
def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all accepted friends"""
    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) | (Friendship.friend_id == current_user.id)) &
        (Friendship.status == "accepted")
    ).all()

    friend_ids = []
    for f in friendships:
        if f.user_id == current_user.id:
            friend_ids.append(f.friend_id)
        else:
            friend_ids.append(f.user_id)

    friends = db.query(User).filter(User.id.in_(friend_ids)).all()
    return friends


@router.get("/requests", response_model=List[FriendshipResponse])
def get_friend_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pending friend requests"""
    requests = db.query(Friendship).filter(
        (Friendship.friend_id == current_user.id) &
        (Friendship.status == "pending")
    ).all()
    return requests
