from sqlalchemy import Column, String, Numeric, Date, ForeignKey, CheckConstraint, Index, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    email = Column(String(255), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='user')
    created_at = Column(String, nullable=False, default=lambda: datetime.now(timezone.utc).isoformat())
    
    # Relationship
    impact_logs = relationship('ImpactLog', back_populates='profile', cascade='all, delete-orphan')
    
    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name='check_role'),
        Index('idx_profiles_role', 'role'),
    )

class ImpactLog(Base):
    __tablename__ = 'impact_logs'
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    locality = Column(String(255), nullable=False)
    gps_latitude = Column(Numeric, nullable=False)
    gps_longitude = Column(Numeric, nullable=False)
    impact_date = Column(Date, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String(50), nullable=False, default='Solving')
    created_at = Column(String, nullable=False, default=lambda: datetime.now(timezone.utc).isoformat())
    
    # Relationship
    profile = relationship('Profile', back_populates='impact_logs')
    
    __table_args__ = (
        CheckConstraint("category IN ('Road', 'Water', 'Sanitation', 'Electricity', 'Other')", name='check_category'),
        CheckConstraint("status IN ('Solving', 'Solved', 'Fake')", name='check_status'),
        Index('idx_impact_logs_status', 'status'),
        Index('idx_impact_logs_category', 'category'),
        Index('idx_impact_logs_impact_date', 'impact_date'),
    )