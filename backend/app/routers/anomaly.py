from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid as uuid_lib
from ..database import get_db
from ..models.anomaly import AnomalyAlert
from ..models.user import User
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..config import JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/api/anomalies", tags=["Anomaly Detection"])
security = HTTPBearer()


class AnomalyResponse(BaseModel):
    id: str
    patient_id: str
    severity: str
    detection_methods: list
    details: Optional[dict]
    acknowledged: bool
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


@router.get("/{patient_id}", response_model=list[AnomalyResponse])
async def get_patient_anomalies(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all anomaly alerts for a patient, most recent first."""
    result = await db.execute(
        select(AnomalyAlert)
        .where(AnomalyAlert.patient_id == patient_id)
        .order_by(desc(AnomalyAlert.created_at))
        .limit(50)
    )
    alerts = result.scalars().all()

    return [AnomalyResponse(
        id=str(a.id),
        patient_id=str(a.patient_id),
        severity=a.severity,
        detection_methods=a.detection_methods or [],
        details=a.details,
        acknowledged=a.acknowledged,
        created_at=a.created_at,
    ) for a in alerts]


@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark an anomaly alert as acknowledged."""
    result = await db.execute(
        select(AnomalyAlert).where(AnomalyAlert.id == alert_id)
    )
    alert = result.scalar_one_or_none()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    alert.acknowledged_by = current_user.id
    alert.acknowledged_at = datetime.utcnow()
    await db.commit()

    return {"message": "Alert acknowledged", "id": str(alert.id)}
