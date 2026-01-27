"""
Script to create admin user
"""
import asyncio
from database import AsyncSessionLocal
from models import Profile
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin exists
        from sqlalchemy import select
        result = await db.execute(select(Profile).where(Profile.email == "admin@test.com"))
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"Admin user already exists: {existing.email}")
            return
        
        # Create admin
        admin = Profile(
            email="admin@test.com",
            name="Admin User",
            password_hash=pwd_context.hash("123456"),
            role="admin"
        )
        db.add(admin)
        await db.commit()
        
        print(f"✅ Admin user created successfully!")
        print(f"Email: admin@test.com")
        print(f"Password: admin123")
        print(f"")
        print(f"IMPORTANT: Change the password after first login!")

if __name__ == "__main__":
    asyncio.run(create_admin())
