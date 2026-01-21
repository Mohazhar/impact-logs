# Supabase Setup Instructions for Local Impact Log

This guide will help you set up Supabase for the Local Impact Log application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **Settings** (gear icon) → **API**
4. Copy the following:
   - **Project URL**: `https://jmpqtrdqoogeqgbedmws.supabase.co` (already provided)
   - **anon public key**: Copy this key

## Step 2: Update Environment Variable

1. Open `/app/frontend/.env` file
2. Replace `your_supabase_anon_key_here` with your actual **anon public key**:

```env
REACT_APP_BACKEND_URL=https://e1-humberto-pham-16815.emergent.build
REACT_APP_SUPABASE_URL=https://jmpqtrdqoogeqgbedmws.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 3: Create Database Tables

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

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

-- Create indexes for better performance
CREATE INDEX idx_impact_logs_user_id ON impact_logs(user_id);
CREATE INDEX idx_impact_logs_status ON impact_logs(status);
CREATE INDEX idx_impact_logs_category ON impact_logs(category);
CREATE INDEX idx_impact_logs_impact_date ON impact_logs(impact_date);
CREATE INDEX idx_profiles_role ON profiles(role);
```

4. Click **Run** to execute the SQL

## Step 4: Set Up Row Level Security (RLS)

1. In the SQL Editor, create a new query
2. Copy and paste the following SQL:

```sql
-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Impact logs policies
-- Users can insert their own logs
CREATE POLICY "Users can insert own logs"
  ON impact_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own logs
CREATE POLICY "Users can view own logs"
  ON impact_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all logs
CREATE POLICY "Admins can view all logs"
  ON impact_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all logs
CREATE POLICY "Admins can update all logs"
  ON impact_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

3. Click **Run** to execute the SQL

## Step 5: Enable Realtime for Impact Logs

1. In your Supabase Dashboard, go to **Database** → **Replication**
2. Find the `impact_logs` table
3. Toggle **Enable Realtime** to ON
4. Click **Save**

## Step 6: Configure Authentication

1. In your Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Optional: Configure email templates under **Authentication** → **Email Templates**

## Step 7: Create Admin Account

Since admin accounts cannot be created through signup, you need to create them manually:

### Option 1: Via Supabase Dashboard UI

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: `admin@example.com` (or your admin email)
   - Password: Create a strong password
   - Auto Confirm User: **Yes**
4. Click **Create User**
5. Copy the User ID
6. Go to **Database** → **Table Editor** → **profiles**
7. Click **Insert** → **Insert row**
8. Enter:
   - id: Paste the User ID
   - email: Same as above
   - name: Admin name (e.g., "System Admin")
   - role: `admin`
9. Click **Save**

### Option 2: Via SQL Editor

1. Go to **SQL Editor**
2. Run the following SQL (replace with your values):

```sql
-- First, create the auth user
-- Note: You'll need to do this via the Dashboard UI first to get the user_id
-- Then run this to create the profile:

INSERT INTO profiles (id, email, name, role)
VALUES (
  'user-id-from-auth-users',  -- Replace with actual auth user ID
  'admin@example.com',
  'System Admin',
  'admin'
);
```

## Step 8: Restart Frontend

After setting up everything:

```bash
sudo supervisorctl restart frontend
```

## Testing the Application

1. **Test User Flow:**
   - Go to the landing page
   - Click "Sign Up"
   - Create a new user account
   - Submit an impact log
   - Check if the log appears in "My Logs"

2. **Test Admin Flow:**
   - Go to landing page
   - Navigate to "Admin Login" (in footer)
   - Login with admin credentials
   - Verify you can see all user logs
   - Update a log status
   - Check if the user sees the update in real-time

## Troubleshooting

### Issue: "Supabase credentials missing" error

**Solution:** Make sure you've updated the `.env` file with your actual `REACT_APP_SUPABASE_ANON_KEY`

### Issue: User can't see their logs

**Solution:** Check RLS policies are correctly set up. Run the RLS SQL from Step 4 again.

### Issue: Real-time updates not working

**Solution:** 
1. Ensure Realtime is enabled for `impact_logs` table (Step 5)
2. Check browser console for WebSocket connection errors
3. Verify your Supabase project has Realtime enabled in project settings

### Issue: Admin can't update log status

**Solution:** 
1. Verify the admin account has `role = 'admin'` in the profiles table
2. Check RLS policies for admins are correctly set up
3. Make sure the admin is logged in through the Admin Login page

### Issue: "Invalid login credentials"

**Solution:** 
1. For users: Try signing up instead
2. For admins: Verify the admin account exists in both `auth.users` and `profiles` tables

## Security Notes

- **NEVER** commit your `.env` file with actual credentials to git
- The `anon` key is safe to use in frontend (it's public)
- Row Level Security ensures users can only access their own data
- Admins are identified by the `role` field in the `profiles` table

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Documentation](https://supabase.com/docs/guides/realtime)
