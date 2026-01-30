import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { MapPin, ArrowLeft, Globe } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTamil, setIsTamil] = useState(true);

  // Content Strings
  const t = {
    back: isTamil ? "முகப்பிற்குச் செல்ல" : "Back to Home",
    title: isTamil ? "கணக்கை உருவாக்குங்கள்" : "Create Account",
    name: isTamil ? "முழு பெயர்" : "Full Name",
    email: isTamil ? "மின்னஞ்சல்" : "Email",
    password: isTamil ? "கடவுச்சொல்" : "Password",
    minChar: isTamil ? "குறைந்தது 6 எழுத்துக்கள்" : "Minimum 6 characters",
    signup: isTamil ? "பதிவு செய்க" : "Sign Up",
    creating: isTamil ? "கணக்கு உருவாக்கப்படுகிறது..." : "Creating account...",
    hasAccount: isTamil ? "ஏற்கனவே கணக்கு உள்ளதா?" : "Already have an account?",
    login: isTamil ? "உள்நுழை" : "Login",
    placeholderName: "John Doe",
    placeholderEmail: "you@example.com",
    placeholderPass: "••••••••"
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success(isTamil ? 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!' : 'Account created successfully!');
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsTamil(!isTamil)}
            className="px-4 py-2 border border-tvk-gold/30 rounded-md text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2 transition-all bg-black/20 backdrop-blur-sm"
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
              <MapPin className="h-6 w-6 text-tvk-dark" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>
              {t.title}
            </h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.name}
              </Label>
              <Input
                id="name"
                data-testid="signup-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-tvk-gold/80">
                {t.email}
              </Label>
              <Input
                id="email"
                data-testid="signup-email-input"
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
                data-testid="signup-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white rounded-none focus:ring-0 focus:border-tvk-gold h-12 transition-all placeholder:text-gray-600"
                placeholder={t.placeholderPass}
              />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.minChar}</p>
            </div>

            <Button
              data-testid="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-tvk-gold hover:bg-yellow-400 text-tvk-dark h-14 rounded-none font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/10 transition-all active:scale-[0.98]"
            >
              {loading ? t.creating : t.signup}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-medium">
              {t.hasAccount}{' '}
              <Link
                data-testid="signup-login-link"
                to="/login"
                className="text-tvk-gold hover:text-yellow-400 font-black uppercase tracking-widest ml-1 underline decoration-tvk-gold/30 underline-offset-4"
              >
                {t.login}
              </Link>
            </p>
          </div>
        </div>

        {/* Brand Slogan */}
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
          பிறப்பொக்கும் எல்லா உயிர்க்கும்
        </p>
      </div>
    </div>
  );
}