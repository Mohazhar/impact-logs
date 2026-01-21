# Local Impact Log

A professional web application for community impact tracking where citizens can report local infrastructure issues (roads, water, sanitation, electricity) and administrators can manage and resolve them in real-time.

## 🎯 Features

### Public Website
- Professional landing page with hero section
- Clear explanation of platform purpose
- Navigation: Home, About, How It Works
- Call-to-action buttons for Sign Up and Login
- Admin Login link in footer

### User Features
- **Sign Up & Login**: Email/password authentication via Supabase Auth
- **Add Impact Logs**: Submit infrastructure issues with:
  - GPS auto-detection with manual override
  - Issue details (name, locality, date, category, description)
  - Categories: Road, Water, Sanitation, Electricity, Other
- **View My Logs**: See only your submitted logs
- **Real-time Updates**: Receive instant status updates when admins review logs
- **Status Tracking**: Monitor issue progression (Solving → Solved/Fake)

### Admin Features
- **Separate Admin Login**: Distinct authentication flow
- **View All Logs**: See submissions from all users
- **Advanced Filtering**: Filter by date, category, and status
- **Detail View**: Click any log to view complete information
- **Status Management**: Update log status (Solving/Solved/Fake)
- **Real-time Sync**: Changes instantly reflect in user dashboards
- **Analytics Dashboard**: Quick stats on total reports, solving, solved, and fake reports

## 🛠️ Tech Stack

- **Frontend**: React 19 with modern hooks
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS with custom Civic Emerald theme
- **UI Components**: Shadcn/UI with Radix UI primitives
- **Fonts**: Outfit (headings) & Public Sans (body)
- **State Management**: React Context API
- **Routing**: React Router v7

## 🎨 Design System

- **Primary Color**: Civic Emerald (#047857) - Trust and civic responsibility
- **Secondary Color**: Alert Amber (#F59E0B) - Status indicators
- **Background**: Public Stone (#FAFAF9) - Professional, government-grade look
- **Typography**: 
  - Headings: Outfit (modern, approachable)
  - Body: Public Sans (government-grade legibility)

## 📋 Prerequisites

1. Node.js 16+ and Yarn
2. Supabase account and project
3. Supabase credentials:
   - Project URL
   - Anon public key

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd /app/frontend
yarn install
```

### 2. Configure Supabase

Follow the detailed setup guide in [SUPABASE_SETUP.md](/app/SUPABASE_SETUP.md):

1. Get your Supabase credentials
2. Update `/app/frontend/.env` with your `REACT_APP_SUPABASE_ANON_KEY`
3. Create database tables (profiles, impact_logs)
4. Set up Row Level Security (RLS) policies
5. Enable Realtime for `impact_logs` table
6. Create admin account(s)

### 3. Start the Application

```bash
sudo supervisorctl restart frontend
```

The app will be available at: `http://localhost:3000`

## 📚 Application Structure

```
/app/frontend/src/
├── components/
│   ├── ui/              # Shadcn/UI components
│   └── ProtectedRoute.js # Route protection with role checking
├── contexts/
│   └── AuthContext.js   # Authentication state management
├── lib/
│   └── supabase.js      # Supabase client configuration
├── pages/
│   ├── LandingPage.js   # Public homepage
│   ├── LoginPage.js     # User login
│   ├── SignupPage.js    # User registration
│   ├── AdminLoginPage.js # Admin authentication
│   ├── UserDashboard.js # User dashboard (add logs, view own logs)
│   └── AdminDashboard.js # Admin dashboard (view all, manage status)
├── App.js               # Main app with routing
└── index.css            # Global styles with design tokens
```

## 🔐 Authentication & Authorization

### User Roles

1. **User** (`role: 'user'`)
   - Can sign up via the app
   - Can login and access `/dashboard`
   - Can create and view their own impact logs
   - Receives real-time status updates

2. **Admin** (`role: 'admin'`)
   - Must be created manually in Supabase
   - Can login via `/admin-login`
   - Can access `/admin` dashboard
   - Can view all logs from all users
   - Can update log status (Solving/Solved/Fake)

### Row Level Security (RLS)

- Users can only read/write their own logs
- Admins can read/update all logs
- Enforced at database level via Supabase RLS policies

## 🌐 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | User login |
| `/signup` | Public | User registration |
| `/admin-login` | Public | Admin login |
| `/dashboard` | User only | User dashboard |
| `/admin` | Admin only | Admin dashboard |

## 📊 Database Schema

### profiles
- `id` (UUID, PK) - References auth.users
- `email` (TEXT)
- `name` (TEXT)
- `role` (TEXT) - 'user' or 'admin'
- `created_at` (TIMESTAMP)

### impact_logs
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles
- `name` (TEXT)
- `locality` (TEXT)
- `gps_latitude` (NUMERIC)
- `gps_longitude` (NUMERIC)
- `impact_date` (DATE)
- `category` (TEXT) - Road/Water/Sanitation/Electricity/Other
- `description` (TEXT)
- `status` (TEXT) - Solving/Solved/Fake
- `created_at` (TIMESTAMP)

## 🔄 Real-time Features

The application uses Supabase Realtime for instant updates:

- **User Dashboard**: Automatically updates when admin changes log status
- **Admin Dashboard**: Receives notifications when new logs are submitted
- **No page refresh needed**: All updates happen live via WebSocket

## 🎯 Key Functionalities

### GPS Location Detection

- **Auto-detect**: Uses browser's Geolocation API
- **Manual override**: Users can enter coordinates manually
- **Fallback**: If auto-detect fails, prompts for manual entry

### Status Workflow

1. **Solving** (default): Issue reported, awaiting resolution
2. **Solved**: Issue has been resolved by authorities
3. **Fake**: Issue marked as invalid/fake by admin

### Filtering (Admin Only)

- Filter by category (Road, Water, etc.)
- Filter by status (Solving, Solved, Fake)
- Filter by impact date

## 🧪 Testing the App

### Test User Flow
1. Visit the landing page
2. Click "Sign Up" and create an account
3. Login redirects to `/dashboard`
4. Click "Add Impact" and submit a log with GPS location
5. View the log in "My Logs"
6. Wait for admin to update status (real-time update)

### Test Admin Flow
1. Visit landing page
2. Scroll to footer and click "Admin Login"
3. Login with admin credentials
4. View all user logs in admin dashboard
5. Click a log to see details
6. Update status using dropdown
7. Verify user sees the update in real-time

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify `.env` has correct `REACT_APP_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Ensure browser allows cookies and localStorage

### Real-time Not Working
- Enable Realtime for `impact_logs` in Supabase Dashboard
- Check browser console for WebSocket errors
- Verify Supabase project has Realtime enabled

### Login Fails
- For users: Try signing up first
- For admins: Verify admin exists in both `auth.users` and `profiles` tables
- Check RLS policies are correctly set up

### GPS Auto-detect Fails
- Browser must support Geolocation API
- User must grant location permission
- Fallback: Enter coordinates manually

## 📝 Admin Account Creation

Admins cannot sign up via the app. Create manually:

### Via Supabase Dashboard
1. **Authentication** → **Users** → **Add User**
2. Enter email, password, auto-confirm
3. Copy the user ID
4. **Database** → **profiles** → **Insert row**
5. Set `id` (user ID), `email`, `name`, `role='admin'`

See [SUPABASE_SETUP.md](/app/SUPABASE_SETUP.md) for detailed instructions.

## 🔒 Security Best Practices

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables for sensitive data
- ✅ Supabase anon key (safe for frontend)
- ✅ Role-based access control
- ✅ Protected routes with authentication
- ✅ Input validation on forms
- ✅ Secure password handling via Supabase Auth

## 🎨 UI/UX Highlights

- **Modern SaaS Design**: Professional, suitable for government/enterprise
- **Responsive**: Mobile, tablet, desktop optimized
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Spinners and skeletons
- **Toast Notifications**: Real-time feedback (Sonner)
- **Empty States**: Clear messaging when no data
- **Status Badges**: Color-coded (green=solved, amber=solving, red=fake)
- **Sticky Navigation**: Always accessible
- **Glassmorphism**: Subtle backdrop blur effects

## 📄 License

This project is built for demonstration purposes.

## 🙏 Credits

- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **Backend**: Supabase
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Outfit, Public Sans)

## 📞 Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](/app/SUPABASE_SETUP.md) for setup help
2. Review troubleshooting section above
3. Check browser console for errors
4. Verify Supabase Dashboard settings

---

**Built with Emergent** - Making civic engagement accessible and efficient.
