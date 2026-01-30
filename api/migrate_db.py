"""
Migration script to add missing columns to existing Supabase tables
"""
import asyncio
from database import ASYNC_DATABASE_URL
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def migrate():
    engine = create_async_engine(
        ASYNC_DATABASE_URL,
        connect_args={"statement_cache_size": 0}
    )
    
    async with engine.begin() as conn:
        print("Adding email and password_hash columns to profiles...")
        try:
            await conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT ''"))
            await conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT ''"))
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)"))
            print("✅ Profiles table updated")
        except Exception as e:
            print(f"Profiles migration error: {e}")
        
        print("\nAdding gps columns to impact_logs...")
        try:
            # Check if old columns exist
            result = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='impact_logs' AND column_name IN ('latitude', 'longitude')"))
            old_cols = [row[0] for row in result.fetchall()]
            
            if 'latitude' in old_cols:
                await conn.execute(text("ALTER TABLE impact_logs RENAME COLUMN latitude TO gps_latitude"))
                print("✅ Renamed latitude to gps_latitude")
            else:
                print("ℹ️  latitude column not found or already renamed")
            
            if 'longitude' in old_cols:
                await conn.execute(text("ALTER TABLE impact_logs RENAME COLUMN longitude TO gps_longitude"))
                print("✅ Renamed longitude to gps_longitude")
            else:
                print("ℹ️  longitude column not found or already renamed")
                
        except Exception as e:
            print(f"Impact logs migration error: {e}")
    
    await engine.dispose()
    print("\n✅ Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate())
