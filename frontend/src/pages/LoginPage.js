import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { MapPin, ArrowLeft, Globe } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTamil, setIsTamil] = useState(true);

  // Content Strings
  const t = {
    back: isTamil ? "முகப்பிற்குச் செல்ல" : "Back to Home",
    title: isTamil ? "பயனர் உள்நுழைவு" : "User Login",
    email: isTamil ? "மின்னஞ்சல்" : "Email",
    password: isTamil ? "கடவுச்சொல்" : "Password",
    login: isTamil ? "உள்நுழை" : "Login",
    loggingIn: isTamil ? "உள்நுழைகிறது..." : "Logging in...",
    noAccount: isTamil ? "கணக்கு இல்லையா?" : "Don't have an account?",
    signup: isTamil ? "பதிவு செய்க" : "Sign Up",
    placeholderEmail: "you@example.com",
    placeholderPass: "••••••••"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // The signIn function should be defined in your AuthContext.js
      // Ensure the API_URL there is set to: https://impact-logs-three.vercel.app/api
      await signIn(email.trim(), password);
      
      toast.success(isTamil ? 'உள்நுழைவு வெற்றிகரமாக முடிந்தது!' : 'Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Full Login Error Context:', error);
      
      // Detailed error breakdown for debugging
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      if (status === 405) {
        toast.error("Server Configuration Error (405). Please contact admin.");
      } else if (status === 401 || detail === "Invalid email or password") {
        toast.error(isTamil ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்' : 'Invalid email or password');
      } else if (status === 500) {
        toast.error("Database connection failed. Please try again later.");
      } else {
        toast.error(detail || "Login failed. Check your connection.");
      }
      
      // Logic for missing accounts
      if (detail && (detail.includes('not found') || detail.includes('exists'))) {
        setTimeout(() => navigate('/signup'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-tvk-dark">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsTamil(!isTamil)}
            className="px-4 py-2 border border-tvk-gold/30 rounded-3xl text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2 transition-all bg-black/20"
          >
            <Globe className="w-3 h-3" /> {isTamil ? "ENGLISH" : "தமிழ்"}
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-tvk-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.back}</span>
          </button>

          <div className="flex items-center gap-3 mb-10">
            <div className="bg-tvk-gold p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <MapPin className="h-6 w-6 text-tvk-dark" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {t.title}
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderEmail}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderPass}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-tvk-gold hover:bg-yellow-400 text-tvk-dark h-14 rounded-3xl font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/10 transition-all active:scale-[0.98]"
            >
              {loading ? t.loggingIn : t.login}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-medium">
              {t.noAccount}{' '}
              <Link
                to="/signup"
                className="text-tvk-gold hover:text-yellow-400 font-black uppercase tracking-widest ml-1 underline decoration-tvk-gold/30 underline-offset-4"
              >
                {t.signup}
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
          பிறப்பொக்கும் எல்லா உயிர்க்கும்
        </p>
      </div>
    </div>
  );
}