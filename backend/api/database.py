from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

# 1. Robust Path Resolution
# __file__ is backend/api/database.py. 
# .parent is backend/api/, .parent.parent is backend/
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

# Load the environment variables from the specific backend root path
load_dotenv(dotenv_path=env_path)

# 2. Safety Check for DATABASE_URL
DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    # This provides a clear error message instead of a generic AttributeError
    raise ValueError(
        f"DATABASE_URL not found! The script looked at: {env_path}. "
        "Please check if your .env file exists in the correct folder."
    )

# 3. Handle URL replacement for Asyncpg
ASYNC_DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://')

# 4. Engine Configuration
# Optimized for PgBouncer/Supabase environments
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=False,
    echo=False,
    connect_args={
        # statement_cache_size: 0 is required for PgBouncer transaction mode
        "statement_cache_size": 0,
        "command_timeout": 30,
    }
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()