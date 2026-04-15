"""
Anomaly Alert Model — stores detected anomalies in patient vitals.

WHAT: When a patient's vital reading deviates significantly from their
personal baseline, an anomaly alert is created and stored here.

WHY: Early detection of deterioration saves lives. A Swasthya Mitra
seeing "3 anomalies this week" knows to prioritize that patient.
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base


class AnomalyAlert(Base):
    __tablename__ = "anomaly_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    vital_reading_id = Column(UUID(as_uuid=True), ForeignKey("vitals.id"), nullable=True)

    # Which methods flagged this anomaly
    detection_methods = Column(JSONB, default=[])  # e.g., ["zscore", "isolation_forest"]

    # Severity: info (slight deviation), moderate (concerning), critical (danger)
    severity = Column(String, nullable=False, default="info")

    # Details about the detection
    details = Column(JSONB, nullable=True)
    # Example: {
    #   "vital": "bp_systolic",
    #   "value": 185,
    #   "baseline_mean": 125,
    #   "baseline_std": 8,
    #   "z_score": 7.5,
    #   "if_score": 0.85,
    #   "message": "BP Systolic is critically high..."
    # }

    # Has someone acknowledged this alert?
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
