from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid as uuid_lib
from ..database import get_db
from ..models.timeline import HealthTimeline
from ..models.user import User
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..config import JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/api/timeline", tags=["Timeline"])
security = HTTPBearer()

class TimelineEventCreate(BaseModel):
    patient_id: str
    event_type: str
    title: str
    summary: Optional[str] = None
    detail_json: Optional[dict] = None
    related_id: Optional[str] = None

class TimelineEventResponse(BaseModel):
    id: str
    patient_id: str
    event_type: str
    title: str
    summary: Optional[str]
    detail_json: Optional[dict]
    related_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/", response_model=TimelineEventResponse)
async def create_event(
    data: TimelineEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = HealthTimeline(
        patient_id=uuid_lib.UUID(data.patient_id),
        event_type=data.event_type,
        title=data.title,
        summary=data.summary,
        detail_json=data.detail_json,
        related_id=uuid_lib.UUID(data.related_id) if data.related_id else None
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return TimelineEventResponse(
        id=str(event.id),
        patient_id=str(event.patient_id),
        event_type=event.event_type,
        title=event.title,
        summary=event.summary,
        detail_json=event.detail_json,
        related_id=str(event.related_id) if event.related_id else None,
        created_at=event.created_at
    )

@router.get("/{patient_id}", response_model=list[TimelineEventResponse])
async def get_timeline(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(HealthTimeline)
        .where(HealthTimeline.patient_id == patient_id)
        .order_by(desc(HealthTimeline.created_at))
        .limit(100)
    )
    events = result.scalars().all()
    return [TimelineEventResponse(
        id=str(e.id),
        patient_id=str(e.patient_id),
        event_type=e.event_type,
        title=e.title,
        summary=e.summary,
        detail_json=e.detail_json,
        related_id=str(e.related_id) if e.related_id else None,
        created_at=e.created_at
    ) for e in events]