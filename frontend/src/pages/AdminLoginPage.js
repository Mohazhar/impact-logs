import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <button
            data-testid="back-to-home-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-emerald-700" />
            <h1 className="text-2xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Admin Login</h1>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <p className="text-sm text-amber-700">
              <strong>Admin Access Only</strong><br />
              Admin accounts must be created manually in Supabase.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-slate-700">Admin Email</Label>
              <Input
                id="admin-email"
                data-testid="admin-login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <Label htmlFor="admin-password" className="text-slate-700">Password</Label>
              <Input
                id="admin-password"
                data-testid="admin-login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              data-testid="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 rounded-md shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}