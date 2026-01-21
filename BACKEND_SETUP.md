# Backend Setup Guide - FastAPI + Supabase PostgreSQL

## Architecture Overview

The application now uses:
- **Frontend**: React → calls Backend API
- **Backend**: FastAPI → connects to Supabase PostgreSQL
- **Database**: Supabase PostgreSQL (via Transaction Pooler)

## Setup Steps

### 1. Database Setup (CRITICAL)

Run this SQL in your Supabase SQL Editor to create the correct schema:

```sql
-- Drop old tables if they exist
DROP TABLE IF EXISTS impact_logs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS status_checks CASCADE;

-- Create profiles table
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

-- Create admin user
-- Email: admin@test.com
-- Password: admin123
INSERT INTO profiles (email, name, password_hash, role) VALUES 
('admin@test.com', 'Admin User', '$2b$12$LKz3M3F9qGjK.ZQxJQG8puO0QY8hR5fZ8Z.VH6hYWxD3gN.rGHKTm', 'admin');
```

### 2. Environment Variables

Your backend `.env` is already configured:
```env
DATABASE_URL=postgresql://postgres.jmpqtrdqoogeqgbedmws:Azharagul%4022@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

**Note**: Password special characters are URL-encoded (`@` becomes `%40`)

### 3. Backend Dependencies

Already installed:
- fastapi
- uvicorn
- sqlalchemy[asyncio]
- asyncpg
- alembic
- psycopg2-binary
- python-jose
- passlib[bcrypt]
- pyjwt

### 4. API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile (requires auth)

#### Impact Logs
- `POST /api/impact-logs` - Create new impact log (user only)
- `GET /api/impact-logs/my-logs` - Get user's own logs (user only)
- `GET /api/impact-logs/all` - Get all logs (admin only)
- `PATCH /api/impact-logs/{log_id}/status` - Update log status (admin only)

### 5. Authentication Flow

1. **Signup/Login** → Backend returns JWT token + user data
2. **Frontend** → Stores token in localStorage
3. **Subsequent requests** → Token sent in Authorization header
4. **Backend** → Validates token and extracts user info

### 6. Testing the Setup

#### Test Backend API Directly

```bash
# Signup
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get my profile (replace TOKEN)
curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test Complete Flow

1. **Sign Up User**:
   - Go to: http://localhost:3000/signup
   - Create account with email/password
   - Should auto-login and redirect to dashboard

2. **Add Impact Log**:
   - Click "Add Impact"
   - Fill form with GPS location
   - Submit

3. **Admin Login**:
   - Go to: http://localhost:3000/admin-login
   - Login: `admin@test.com` / `admin123`
   - Should redirect to admin dashboard

4. **Update Status**:
   - Select a log
   - Change status to "Solved"
   - Check user dashboard (should update via polling)

### 7. Real-time Updates

Currently using **polling** (every 5 seconds):
- User dashboard polls for log updates
- Admin dashboard polls for new submissions

**Future Enhancement**: Replace polling with WebSocket for true real-time updates

### 8. Troubleshooting

#### "Database connection failed"
- Check DATABASE_URL in `/app/backend/.env`
- Ensure using Transaction Pooler URL (port 6543, not 5432)
- Verify password is URL-encoded

#### "Invalid credentials"
- Check if tables were created with correct SQL
- Verify admin user exists: `SELECT * FROM profiles WHERE role='admin'`

#### "Column does not exist"
- Drop and recreate tables using the SQL above
- Ensure you're using the latest schema

#### "Token expired"
- JWT tokens expire after 24 hours (JWT_EXPIRE_MINUTES=1440)
- User will need to login again

#### Frontend shows "Failed to fetch"
- Check backend is running: `sudo supervisorctl status backend`
- Check logs: `tail -50 /var/log/supervisor/backend.err.log`
- Restart: `sudo supervisorctl restart backend`

### 9. Security Notes

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ SQL injection protection (parameterized queries)
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for auth endpoints

### 10. Database Schema

**profiles**:
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique, required
- `name` (VARCHAR) - User's full name
- `password_hash` (VARCHAR) - Bcrypt hashed password
- `role` (VARCHAR) - 'user' or 'admin'
- `created_at` (VARCHAR) - ISO timestamp

**impact_logs**:
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to profiles
- `name` (VARCHAR) - Issue name
- `locality` (VARCHAR) - Location description
- `gps_latitude` (NUMERIC) - GPS coordinate
- `gps_longitude` (NUMERIC) - GPS coordinate
- `impact_date` (DATE) - When issue occurred
- `category` (VARCHAR) - Road/Water/Sanitation/Electricity/Other
- `description` (TEXT) - Detailed description
- `status` (VARCHAR) - Solving/Solved/Fake
- `created_at` (VARCHAR) - ISO timestamp

### 11. Next Steps

- [ ] Test complete user flow
- [ ] Test admin flow
- [ ] Verify status updates work
- [ ] (Optional) Implement WebSocket for real-time updates
- [ ] (Optional) Add email notifications
- [ ] (Optional) Add password reset functionality
- [ ] (Optional) Add user profile editing
- [ ] (Optional) Add data export for admins

---

**Need Help?** Check backend logs or reach out with specific error messages.
