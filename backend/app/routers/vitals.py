from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid as uuid_lib
import numpy as np
from ..database import get_db
from ..models.vitals import Vitals
from ..models.timeline import HealthTimeline
from ..models.user import User
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..config import JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/api/vitals", tags=["Vitals"])
security = HTTPBearer()

# --- Schemas ---
class VitalsCreate(BaseModel):
    patient_id: str
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    spo2: Optional[float] = None
    temperature: Optional[float] = None
    blood_glucose: Optional[float] = None
    notes: Optional[str] = None

class VitalsResponse(BaseModel):
    id: str
    patient_id: str
    bp_systolic: Optional[int]
    bp_diastolic: Optional[int]
    heart_rate: Optional[int]
    spo2: Optional[float]
    temperature: Optional[float]
    blood_glucose: Optional[float]
    notes: Optional[str]
    source: str
    recorded_at: datetime

    class Config:
        from_attributes = True

# --- Helper: get current user from token ---
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

# --- Endpoints ---
@router.post("/", response_model=VitalsResponse)
async def record_vitals(
    data: VitalsCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate ranges
    if data.bp_systolic and not (60 <= data.bp_systolic <= 250):
        raise HTTPException(status_code=400, detail="BP systolic must be between 60 and 250")
    if data.bp_diastolic and not (40 <= data.bp_diastolic <= 150):
        raise HTTPException(status_code=400, detail="BP diastolic must be between 40 and 150")
    if data.heart_rate and not (30 <= data.heart_rate <= 250):
        raise HTTPException(status_code=400, detail="Heart rate must be between 30 and 250")
    if data.spo2 and not (50 <= data.spo2 <= 100):
        raise HTTPException(status_code=400, detail="SpO2 must be between 50 and 100")
    if data.temperature and not (90 <= data.temperature <= 110):
        raise HTTPException(status_code=400, detail="Temperature must be between 90 and 110°F")
    if data.blood_glucose and not (20 <= data.blood_glucose <= 600):
        raise HTTPException(status_code=400, detail="Blood glucose must be between 20 and 600")

    # Save vitals
    vitals = Vitals(
        patient_id=uuid_lib.UUID(data.patient_id),
        recorded_by=current_user.id,
        bp_systolic=data.bp_systolic,
        bp_diastolic=data.bp_diastolic,
        heart_rate=data.heart_rate,
        spo2=data.spo2,
        temperature=data.temperature,
        blood_glucose=data.blood_glucose,
        notes=data.notes,
        source="manual"
    )
    db.add(vitals)
    await db.flush()  # Get the ID without committing — stays in same transaction

    # Auto-create timeline event
    summary_parts = []
    if data.bp_systolic and data.bp_diastolic:
        summary_parts.append(f"BP: {data.bp_systolic}/{data.bp_diastolic} mmHg")
    if data.heart_rate:
        summary_parts.append(f"HR: {data.heart_rate} bpm")
    if data.spo2:
        summary_parts.append(f"SpO2: {data.spo2}%")
    if data.temperature:
        summary_parts.append(f"Temp: {data.temperature}°F")
    if data.blood_glucose:
        summary_parts.append(f"Glucose: {data.blood_glucose} mg/dL")

    timeline_event = HealthTimeline(
        patient_id=uuid_lib.UUID(data.patient_id),
        event_type="vitals",
        title="Vitals Recorded",
        summary=", ".join(summary_parts) if summary_parts else "Vitals recorded manually",
        detail_json={
            "bp_systolic": data.bp_systolic,
            "bp_diastolic": data.bp_diastolic,
            "heart_rate": data.heart_rate,
            "spo2": data.spo2,
            "temperature": data.temperature,
            "blood_glucose": data.blood_glucose,
            "notes": data.notes
        },
        related_id=vitals.id
    )
    db.add(timeline_event)

    # Single atomic commit — both vitals and timeline succeed or fail together
    await db.commit()
    await db.refresh(vitals)

    return VitalsResponse(
        id=str(vitals.id),
        patient_id=str(vitals.patient_id),
        bp_systolic=vitals.bp_systolic,
        bp_diastolic=vitals.bp_diastolic,
        heart_rate=vitals.heart_rate,
        spo2=vitals.spo2,
        temperature=vitals.temperature,
        blood_glucose=vitals.blood_glucose,
        notes=vitals.notes,
        source=vitals.source,
        recorded_at=vitals.recorded_at
    )

@router.get("/{patient_id}", response_model=list[VitalsResponse])
async def get_patient_vitals(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Vitals)
        .where(Vitals.patient_id == patient_id)
        .order_by(desc(Vitals.recorded_at))
        .limit(50)
    )
    vitals_list = result.scalars().all()

    return [VitalsResponse(
        id=str(v.id),
        patient_id=str(v.patient_id),
        bp_systolic=v.bp_systolic,
        bp_diastolic=v.bp_diastolic,
        heart_rate=v.heart_rate,
        spo2=v.spo2,
        temperature=v.temperature,
        blood_glucose=v.blood_glucose,
        notes=v.notes,
        source=v.source,
        recorded_at=v.recorded_at
    ) for v in vitals_list]

@router.get("/{patient_id}/latest", response_model=VitalsResponse)
async def get_latest_vitals(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Vitals)
        .where(Vitals.patient_id == patient_id)
        .order_by(desc(Vitals.recorded_at))
        .limit(1)
    )
    vitals = result.scalar_one_or_none()
    if not vitals:
        raise HTTPException(status_code=404, detail="No vitals found for this patient")

    return VitalsResponse(
        id=str(vitals.id),
        patient_id=str(vitals.patient_id),
        bp_systolic=vitals.bp_systolic,
        bp_diastolic=vitals.bp_diastolic,
        heart_rate=vitals.heart_rate,
        spo2=vitals.spo2,
        temperature=vitals.temperature,
        blood_glucose=vitals.blood_glucose,
        notes=vitals.notes,
        source=vitals.source,
        recorded_at=vitals.recorded_at
    )


# ====================================================================
# PHASE 2 — B3: Trend Analysis & Forecasting
# ====================================================================
# WHY: A patient's vitals over time have a TREND. If BP is slowly
# rising week over week, we want to PREDICT where it's heading
# so Swasthya Mitras can intervene BEFORE a crisis.
#
# HOW: Linear regression (numpy) fits a line through historical
# readings, then extends it 7 days into the future. Confidence
# bands show the uncertainty range.
#
# MATH:
#   y = mx + b  (where x = day number, y = vital value)
#   m (slope) = how fast the vital is changing per day
#   b (intercept) = baseline value
#   confidence = ±1.96 * std_dev of residuals (95% CI)
# ====================================================================

VALID_VITALS = ["bp_systolic", "bp_diastolic", "heart_rate", "spo2", "temperature", "blood_glucose"]

@router.get("/{patient_id}/forecast")
async def get_vitals_forecast(
    patient_id: str,
    vital: str = "bp_systolic",
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Forecast a patient's vital trend for the next N days.
    Uses linear regression on historical readings.
    Returns: historical data + forecast + confidence bands.
    """

    # Step 1: Validate the requested vital type
    if vital not in VALID_VITALS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid vital type. Must be one of: {VALID_VITALS}"
        )

    # Step 2: Fetch historical vitals (oldest first for time-series)
    result = await db.execute(
        select(Vitals)
        .where(Vitals.patient_id == patient_id)
        .order_by(Vitals.recorded_at)
        .limit(100)
    )
    vitals_list = result.scalars().all()

    # Step 3: Extract non-null values for the requested vital
    data_points = []
    for v in vitals_list:
        value = getattr(v, vital)
        if value is not None:
            data_points.append({
                "date": v.recorded_at.isoformat(),
                "value": float(value),
                "timestamp": v.recorded_at.timestamp()
            })

    if len(data_points) < 3:
        raise HTTPException(
            status_code=400,
            detail=f"Need at least 3 readings for forecast. Found {len(data_points)}."
        )

    # Step 4: Convert timestamps to "days since first reading"
    t0 = data_points[0]["timestamp"]
    x = np.array([(dp["timestamp"] - t0) / 86400.0 for dp in data_points])
    y = np.array([dp["value"] for dp in data_points])

    # Step 5: Linear regression — y = slope*x + intercept
    coefficients = np.polyfit(x, y, 1)
    slope = coefficients[0]
    intercept = coefficients[1]

    # Step 6: Confidence interval from residuals
    y_predicted = slope * x + intercept
    residuals = y - y_predicted
    std_error = float(np.std(residuals))
    ci_multiplier = 1.96  # 95% confidence

    # Step 7: Generate forecast points
    last_day = x[-1]
    last_date = datetime.fromisoformat(data_points[-1]["date"])

    forecast = []
    for i in range(1, days + 1):
        future_day = last_day + i
        predicted_value = float(slope * future_day + intercept)
        forecast_date = last_date + timedelta(days=i)

        forecast.append({
            "date": forecast_date.isoformat(),
            "value": round(predicted_value, 1),
            "upper": round(predicted_value + ci_multiplier * std_error, 1),
            "lower": round(predicted_value - ci_multiplier * std_error, 1),
        })

    # Step 8: Trend summary
    daily_change = float(slope)
    weekly_change = daily_change * 7
    if abs(weekly_change) < 1:
        trend = "stable"
    elif weekly_change > 0:
        trend = "rising"
    else:
        trend = "falling"

    return {
        "vital": vital,
        "patient_id": patient_id,
        "trend": trend,
        "daily_change": round(daily_change, 2),
        "weekly_change": round(weekly_change, 2),
        "confidence_level": "95%",
        "std_error": round(std_error, 2),
        "historical": [{"date": dp["date"], "value": dp["value"]} for dp in data_points],
        "forecast": forecast,
    }