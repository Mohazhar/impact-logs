import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# 1. Fetch DATABASE_URL from Environment Variables
# Using your provided Pooler link with URL-encoded password as the default
DATABASE_URL = os.environ.get(
    'DATABASE_URL', 
    'postgresql://postgres.jmpqtrdqoogeqgbedmws:Azharagul%4022@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
)

# 2. Convert to Asyncpg format
# Handles both 'postgres://' (common in Heroku/older tools) and 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
else:
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# 3. Engine Configuration Optimized for Serverless (Vercel) + PgBouncer (Supabase)
# 
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    pool_pre_ping=True,      # Automatically checks if a connection is alive before using it
    pool_recycle=300,        # Closes connections every 5 minutes to avoid stale link errors
    pool_size=5,             # Reduced for serverless functions to stay under Supabase limits
    max_overflow=10,
    connect_args={
        # Required for Supabase/PgBouncer in "Transaction Mode"
        "statement_cache_size": 0,
        "command_timeout": 60,
    }
)

# 4. Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# 5. Dependency Injection for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()