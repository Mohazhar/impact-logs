"""
Database initialization script
Run this to create tables in Supabase PostgreSQL
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from models import Base
from database import ASYNC_DATABASE_URL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Connecting to database...")
    engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        logger.info("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("Database initialized successfully!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())
