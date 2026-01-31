import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Shield, ArrowLeft, Globe, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTamil, setIsTamil] = useState(false);

  // Content Strings with high-quality Tamil translations
  const t = {
    back: isTamil ? "முகப்பிற்குச் செல்ல" : "Back to Home",
    title: isTamil ? "நிர்வாகி உள்நுழைவு" : "Admin Login",
    accessOnly: isTamil ? "நிர்வாக அணுகல் மட்டுமே" : "Admin Access Only",
    warning: isTamil ? "நிர்வாகக் கணக்குகள் Supabase-இல் கைமுறையாக உருவாக்கப்பட வேண்டும்." : "Admin accounts must be created manually in Supabase.",
    emailLabel: isTamil ? "நிர்வாகி மின்னஞ்சல்" : "Admin Email",
    passLabel: isTamil ? "கடவுச்சொல்" : "Password",
    loginBtn: isTamil ? "நிர்வாகி உள்நுழைவு" : "Admin Login",
    loggingIn: isTamil ? "உள்நுழைகிறது..." : "Logging in...",
    placeholderEmail: "admin@example.com",
    placeholderPass: "••••••••"
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(isTamil ? 'உள்நுழைவு வெற்றிகரமாக முடிந்தது!' : 'Login successful!');
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsTamil(!isTamil)}
            className="px-4 py-2 border border-tvk-gold/30 rounded-md text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2 transition-all bg-black/20 backdrop-blur-sm uppercase tracking-widest"
          >
            <Globe className="w-3 h-3" /> {isTamil ? "ENGLISH" : "தமிழ்"}
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-none border border-white/10 p-10 shadow-2xl">
          <button
            data-testid="back-to-home-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-tvk-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.back}</span>
          </button>

          <div className="flex items-center gap-3 mb-10">
            <div className="bg-tvk-gold p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Shield className="h-6 w-6 text-tvk-dark" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>
              {t.title}
            </h1>
          </div>

          {/* Prestige Warning Banner */}
          <div className="bg-tvk-gold/5 border border-tvk-gold/20 rounded-none p-5 mb-10 flex gap-4">
            <AlertCircle className="h-5 w-5 text-tvk-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black uppercase text-tvk-gold tracking-widest mb-1">{t.accessOnly}</p>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{t.warning}</p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.emailLabel}
              </Label>
              <Input
                id="admin-email"
                data-testid="admin-login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderEmail}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.passLabel}
              </Label>
              <Input
                id="admin-password"
                data-testid="admin-login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderPass}
              />
            </div>

            <Button
              data-testid="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-tvk-gold hover:bg-yellow-400 text-tvk-dark h-14 rounded-none font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/10 transition-all active:scale-[0.98]"
            >
              {loading ? t.loggingIn : t.loginBtn}
            </Button>
          </form>
        </div>

        {/* Brand Slogan */}
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
          பிறப்பொக்கும் எல்லா உயிர்க்கும்
        </p>
      </div>
    </div>
  );
}