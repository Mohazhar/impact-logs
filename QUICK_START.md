# Quick Start Guide - Local Impact Log

## ⚡ What You Need to Do Now

### Step 1: Get Your Supabase Anon Key (REQUIRED)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **anon public** key
5. Update `/app/frontend/.env` file:
   ```
   REACT_APP_SUPABASE_ANON_KEY=paste_your_key_here
   ```

### Step 2: Set Up Supabase Database (REQUIRED)

Open the SQL Editor in your Supabase Dashboard and run these SQL scripts:

#### A. Create Tables
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create impact_logs table
CREATE TABLE impact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  locality TEXT NOT NULL,
  gps_latitude NUMERIC NOT NULL,
  gps_longitude NUMERIC NOT NULL,
  impact_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Road', 'Water', 'Sanitation', 'Electricity', 'Other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Solving' CHECK (status IN ('Solving', 'Solved', 'Fake')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_impact_logs_user_id ON impact_logs(user_id);
CREATE INDEX idx_impact_logs_status ON impact_logs(status);
CREATE INDEX idx_impact_logs_category ON impact_logs(category);
CREATE INDEX idx_impact_logs_impact_date ON impact_logs(impact_date);
CREATE INDEX idx_profiles_role ON profiles(role);
```

#### B. Enable Row Level Security
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Impact logs policies
CREATE POLICY "Users can insert own logs" ON impact_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own logs" ON impact_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all logs" ON impact_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all logs" ON impact_logs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

### Step 3: Enable Realtime (REQUIRED)

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the `impact_logs` table
3. Toggle **Enable Realtime** to ON
4. Click **Save**

### Step 4: Create Admin Account (REQUIRED for testing admin features)

1. Go to **Authentication** → **Users** → **Add User**
2. Enter:
   - Email: `admin@test.com` (or your email)
   - Password: Create a strong password
   - Auto Confirm User: **Yes**
3. Click **Create User** and **copy the User ID**
4. Go to **Database** → **Table Editor** → **profiles**
5. Click **Insert** → **Insert row**
6. Enter:
   - id: Paste the User ID
   - email: `admin@test.com`
   - name: `Admin User`
   - role: `admin`
7. Click **Save**

### Step 5: Restart Frontend

```bash
sudo supervisorctl restart frontend
```

## ✅ Test Your Setup

### Test User Flow:
1. Go to: http://localhost:3000
2. Click "Sign Up"
3. Create a test user account
4. Go to "Add Impact"
5. Click "Auto-Detect" for GPS (or enter manually: lat: 40.7128, long: -74.0060)
6. Fill in the form and submit
7. Check "My Logs" - you should see your submission

### Test Admin Flow:
1. Go to: http://localhost:3000
2. Scroll to footer and click "Admin Login"
3. Login with: `admin@test.com` and your password
4. You should see all user logs
5. Click a log to view details
6. Change status to "Solved"
7. Open user dashboard in another tab - status should update in real-time!

## 🚨 Common Issues

**"Supabase credentials missing"**
→ Update `.env` file with your actual anon key

**"relation 'profiles' does not exist"**
→ Run the SQL scripts in Step 2

**Admin can't login**
→ Make sure admin exists in both auth.users AND profiles table

**Real-time not working**
→ Enable Realtime for impact_logs table in Step 3

## 📚 Full Documentation

- Detailed setup: `/app/SUPABASE_SETUP.md`
- Project overview: `/app/README.md`

---

**Need Help?** Check the troubleshooting sections in the full documentation files.
