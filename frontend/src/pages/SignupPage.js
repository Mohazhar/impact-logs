import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Signup failed';
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
            <MapPin className="h-8 w-8 text-emerald-700" />
            <h1 className="text-2xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Create Account</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input
                id="name"
                data-testid="signup-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                data-testid="signup-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                data-testid="signup-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="••••••••"
              />
              <p className="text-sm text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            <Button
              data-testid="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 rounded-md shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link
                data-testid="signup-login-link"
                to="/login"
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}