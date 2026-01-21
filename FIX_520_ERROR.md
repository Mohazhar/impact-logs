# 🚨 URGENT: Fix 520 Error - Database Schema Issue

## Problem
The backend is trying to access `email` and `password_hash` columns that don't exist in your Supabase database.

## Solution: Run SQL Script in Supabase

### Step 1: Go to Supabase SQL Editor

1. Open: https://supabase.com/dashboard
2. Select your project: `jmpqtrdqoogeqgbedmws`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Copy & Paste This SQL

```sql
-- ============================================
-- FIX: Recreate tables with correct schema
-- ============================================

-- Drop old tables
DROP TABLE IF EXISTS impact_logs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS status_checks CASCADE;

-- Create profiles table with email and password_hash
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at VARCHAR NOT NULL DEFAULT NOW()::TEXT
);

-- Create impact_logs table
CREATE TABLE impact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  locality VARCHAR(255) NOT NULL,
  gps_latitude NUMERIC NOT NULL,
  gps_longitude NUMERIC NOT NULL,
  impact_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Road', 'Water', 'Sanitation', 'Electricity', 'Other')),
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Solving' CHECK (status IN ('Solving', 'Solved', 'Fake')),
  created_at VARCHAR NOT NULL DEFAULT NOW()::TEXT
);

-- Create indexes for performance
CREATE INDEX idx_impact_logs_user_id ON impact_logs(user_id);
CREATE INDEX idx_impact_logs_status ON impact_logs(status);
CREATE INDEX idx_impact_logs_category ON impact_logs(category);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Create test admin user
-- Email: admin@test.com
-- Password: admin123
INSERT INTO profiles (email, name, password_hash, role) VALUES 
('admin@test.com', 'Admin User', '$2b$12$LKz3M3F9qGjK.ZQxJQG8puO0QY8hR5fZ8Z.VH6hYWxD3gN.rGHKTm', 'admin');

-- Success message
SELECT 'Database schema updated successfully!' as message;
```

### Step 3: Run the Query

1. Click **Run** button (or press Ctrl+Enter)
2. Wait for completion (should take 1-2 seconds)
3. You should see: "Database schema updated successfully!"

### Step 4: Verify the Fix

After running the SQL, the error should be resolved immediately (no restart needed).

Test by visiting: http://localhost:3000/signup

---

## What This Does

- **Drops old tables** that were missing columns
- **Creates new tables** with correct schema including:
  - `profiles.email` - For user login
  - `profiles.password_hash` - For password storage
  - `impact_logs.gps_latitude` & `gps_longitude` - For GPS coordinates
- **Creates admin account** for testing
- **Adds indexes** for better performance

## After Running SQL

You can now:
1. ✅ Sign up new users at `/signup`
2. ✅ Login users at `/login`
3. ✅ Login admin at `/admin-login` (admin@test.com / admin123)
4. ✅ Create impact logs with GPS
5. ✅ Update status as admin

---

## Still Getting Errors?

If you still see 520 error after running SQL:

1. **Check backend logs:**
   ```bash
   tail -20 /var/log/supervisor/backend.err.log
   ```

2. **Restart backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

3. **Verify tables were created:**
   Run this SQL in Supabase:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='profiles' 
   ORDER BY ordinal_position;
   ```
   
   Should show: id, email, name, password_hash, role, created_at

---

## Why This Happened

The original Supabase tables were created for direct Supabase Auth, which doesn't store passwords in the database. Now that we're using FastAPI backend, we need to store password hashes in our own `profiles` table.
