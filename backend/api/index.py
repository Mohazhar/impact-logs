from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timedelta, timezone, date
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
import jwt  # noqa: F401
from passlib.context import CryptContext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_db
from models import Profile, ImpactLog

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRE_MINUTES = int(os.environ.get('JWT_EXPIRE_MINUTES', '1440'))

security = HTTPBearer()

# Create the main app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}
# Create API router
api_router = APIRouter(prefix="/api")

# Pydantic models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class ProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class ImpactLogCreate(BaseModel):
    name: str
    locality: str
    gps_latitude: float
    gps_longitude: float
    impact_date: date
    category: str
    description: str

class ImpactLogResponse(BaseModel):
    id: str
    user_id: str
    name: str
    locality: str
    gps_latitude: float
    gps_longitude: float
    impact_date: str
    category: str
    description: str
    status: str
    created_at: str
    profile: Optional[dict] = None

class StatusUpdate(BaseModel):
    status: str

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        result = await db.execute(select(Profile).where(Profile.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth routes
@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(Profile).where(Profile.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = Profile(
        email=request.email,
        name=request.name,
        password_hash=hash_password(request.password),
        role='user'
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create token
    token = create_access_token({"sub": str(new_user.id), "role": new_user.role})
    
    return {
        "token": token,
        "user": {
            "id": str(new_user.id),
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        }
    }

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(Profile).where(Profile.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_access_token({"sub": str(user.id), "role": user.role})
    
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

@api_router.get("/auth/me", response_model=ProfileResponse)
async def get_me(current_user: Profile = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }

# Impact logs routes (Protected - Require Authentication)
@api_router.post("/impact-logs", response_model=ImpactLogResponse)
async def create_impact_log(request: ImpactLogCreate, current_user: Profile = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_log = ImpactLog(
        user_id=current_user.id,
        name=request.name,
        locality=request.locality,
        gps_latitude=request.gps_latitude,
        gps_longitude=request.gps_longitude,
        impact_date=request.impact_date,
        category=request.category,
        description=request.description,
        status='Solving'
    )
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    
    return {
        "id": str(new_log.id),
        "user_id": str(new_log.user_id),
        "name": new_log.name,
        "locality": new_log.locality,
        "gps_latitude": float(new_log.gps_latitude),
        "gps_longitude": float(new_log.gps_longitude),
        "impact_date": str(new_log.impact_date),
        "category": new_log.category,
        "description": new_log.description,
        "status": new_log.status,
        "created_at": new_log.created_at
    }

@api_router.get("/impact-logs/my-logs", response_model=List[ImpactLogResponse])
async def get_my_logs(current_user: Profile = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ImpactLog)
        .where(ImpactLog.user_id == current_user.id)
        .order_by(ImpactLog.created_at.desc())
    )
    logs = result.scalars().all()
    
    return [
        {
            "id": str(log.id),
            "user_id": str(log.user_id),
            "name": log.name,
            "locality": log.locality,
            "gps_latitude": float(log.gps_latitude),
            "gps_longitude": float(log.gps_longitude),
            "impact_date": str(log.impact_date),
            "category": log.category,
            "description": log.description,
            "status": log.status,
            "created_at": log.created_at
        }
        for log in logs
    ]

@api_router.get("/impact-logs/all", response_model=List[ImpactLogResponse])
async def get_all_logs(current_user: Profile = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Check if admin
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.execute(
        select(ImpactLog, Profile)
        .join(Profile, ImpactLog.user_id == Profile.id)
        .order_by(ImpactLog.created_at.desc())
    )
    rows = result.all()
    
    return [
        {
            "id": str(log.id),
            "user_id": str(log.user_id),
            "name": log.name,
            "locality": log.locality,
            "gps_latitude": float(log.gps_latitude),
            "gps_longitude": float(log.gps_longitude),
            "impact_date": str(log.impact_date),
            "category": log.category,
            "description": log.description,
            "status": log.status,
            "created_at": log.created_at,
            "profile": {
                "name": profile.name,
                "email": profile.email
            }
        }
        for log, profile in rows
    ]

@api_router.patch("/impact-logs/{log_id}/status", response_model=ImpactLogResponse)
async def update_log_status(
    log_id: str,
    status_update: StatusUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if admin
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Find log
    result = await db.execute(select(ImpactLog).where(ImpactLog.id == log_id))
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    # Update status
    log.status = status_update.status
    await db.commit()
    await db.refresh(log)
    
    return {
        "id": str(log.id),
        "user_id": str(log.user_id),
        "name": log.name,
        "locality": log.locality,
        "gps_latitude": float(log.gps_latitude),
        "gps_longitude": float(log.gps_longitude),
        "impact_date": str(log.impact_date),
        "category": log.category,
        "description": log.description,
        "status": log.status,
        "created_at": log.created_at
    }

# PUBLIC ENDPOINTS (No Authentication Required) - FOR LIVE MAPS
@api_router.get("/public/impact-logs", response_model=List[ImpactLogResponse])
async def get_public_logs(db: AsyncSession = Depends(get_db)):
    """
    Public endpoint to view all impact logs with location data
    This is used by Live Maps page
    """
    try:
        result = await db.execute(
            select(ImpactLog)
            .order_by(ImpactLog.created_at.desc())
            .limit(500)
        )
        logs = result.scalars().all()
        
        return [
            {
                "id": str(log.id),
                "user_id": str(log.user_id),
                "name": log.name,
                "locality": log.locality,
                "gps_latitude": float(log.gps_latitude),
                "gps_longitude": float(log.gps_longitude),
                "impact_date": str(log.impact_date),
                "category": log.category,
                "description": log.description,
                "status": log.status,
                "created_at": log.created_at
            }
            for log in logs
        ]
    except Exception as e:
        logger.error(f"Error fetching public logs: {e}")
        return []

@api_router.get("/public/stats")
async def get_public_stats(db: AsyncSession = Depends(get_db)):
    """
    Public endpoint for statistics
    Used by Impact Stats page
    """
    try:
        result = await db.execute(select(ImpactLog))
        all_logs = result.scalars().all()
        
        total = len(all_logs)
        solving = len([l for l in all_logs if l.status == 'Solving'])
        solved = len([l for l in all_logs if l.status == 'Solved'])
        fake = len([l for l in all_logs if l.status == 'Fake'])
        
        # Category breakdown
        categories = {}
        for log in all_logs:
            categories[log.category] = categories.get(log.category, 0) + 1
        
        return {
            "total_reports": total,
            "solving": solving,
            "solved": solved,
            "fake": fake,
            "categories": categories,
            "resolution_rate": round((solved / total * 100) if total > 0 else 0, 1)
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return {
            "total_reports": 0,
            "solving": 0,
            "solved": 0,
            "fake": 0,
            "categories": {},
            "resolution_rate": 0
        }

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

