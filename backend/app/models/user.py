from sqlalchemy import Column,String,Integer,Enum,DateTime,func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database import Base

class User(Base):
    __tablename__="users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(Enum("male", "female", "other", name="gender_enum"), nullable=True)
    role = Column(Enum("patient", "mitra", "doctor", "admin", name="role_enum"), nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

