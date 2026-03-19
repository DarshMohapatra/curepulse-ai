from sqlalchemy import Column,Integer,Float,String,DateTime,ForeignKey,func
from sqlalchemy.dialects.postgresql import UUID
import uuid 
from ..database import Base

class Vitals(Base):
    __tablename__="vitals"

    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True),ForeignKey("users.id"),nullable=False)
    recorded_by = Column(UUID(as_uuid=True),ForeignKey("users.id"),nullable=True)
    bp_systolic= Column(Integer,nullable=True)
    bp_diastolic= Column(Integer,nullable=True)
    heart_rate= Column(Integer,nullable=True)
    spo2= Column(Float,nullable=True)
    temperature = Column("temperature", Float, nullable=True)
    blood_glucose= Column(Float,nullable=True)
    source= Column(String,default="manual")
    notes= Column(String,nullable=True)
    recorded_at= Column(DateTime(timezone=True),server_default=func.now())
    