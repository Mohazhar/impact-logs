from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timedelta, timezone, date
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext

# Relative imports are essential for Vercel's directory structure
from .database import get_db
from .models import Profile, ImpactLog

# Setup logging for production debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT and Secret settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRE_MINUTES = int(os.environ.get('JWT_EXPIRE_MINUTES', '1440'))

security = HTTPBearer()

# Create the main FastAPI instance
app = FastAPI(title="Local Impact Log API")

# Senior Developer Fix: Explicit CORS configuration to prevent redirect errors
# Pull origins from environment or default to your known Vercel domains
ALLOWED_ORIGINS = os.environ.get(
    'CORS_ORIGINS', 
    'https://impact-logs-five.vercel.app,https://impact-logs-vant.vercel.app,http://localhost:3000,http://localhost:5173'
).split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for Vercel deployment health check
@app.get("/")
def root():
    return {"status": "Backend active", "timestamp": str(datetime.now())}

# Create API router for versioned or grouped routes
api_router = APIRouter(prefix="/api")

# --- Pydantic Data Models (Schemas) ---
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

# --- Security & Auth Helper Functions ---
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
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        
        result = await db.execute(select(Profile).where(Profile.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User associated with token not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Authentication token has expired")
    except jwt.PyJWTError: 
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# --- Authentication Endpoints ---
@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).where(Profile.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    new_user = Profile(
        email=request.email,
        name=request.name,
        password_hash=hash_password(request.password),
        role='user'
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
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
    result = await db.execute(select(Profile).where(Profile.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
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

# --- Protected Impact Log Endpoints ---
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
        "created_at": str(new_log.created_at)
    }

@api_router.get("/impact-logs/all", response_model=List[ImpactLogResponse])
async def get_all_logs(current_user: Profile = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Administrative privileges required")
    
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
            "created_at": str(log.created_at),
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
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Administrative privileges required")
    
    result = await db.execute(select(ImpactLog).where(ImpactLog.id == log_id))
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(status_code=404, detail="Impact log record not found")
    
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
        "created_at": str(log.created_at)
    }

# --- Public Map Endpoints (No Auth Required) ---
@api_router.get("/public/impact-logs", response_model=List[ImpactLogResponse])
async def get_public_logs(db: AsyncSession = Depends(get_db)):
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
                "created_at": str(log.created_at)
            }
            for log in logs
        ]
    except Exception as e:
        logger.error(f"Error fetching public map logs: {e}")
        return []

# Final Step: Include the unified router into the main app instance
app.include_router(api_router)