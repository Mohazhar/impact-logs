import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, Users, TrendingUp, ArrowRight, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();
  // Default to Tamil as per the official reference style
  const [isTamil, setIsTamil] = useState(true);

  // Exact content strings maintained from your original logic
  const t = {
    // Navbar
    home: isTamil ? "முகப்பு" : "Home",
    liveMaps: isTamil ? "நேரலை வரைபடம்" : "Live Maps",
    impactStats: isTamil ? "தாக்க புள்ளிவிவரங்கள்" : "Impact Stats",
    community: isTamil ? "சமூகம்" : "Community",
    mission: isTamil ? "லட்சியம்" : "Mission",
    roadmap: isTamil ? "திட்டவரைபடம்" : "Roadmap",
    login: isTamil ? "உள்நுழை" : "Login",
    signup: isTamil ? "பதிவு செய்க" : "Sign Up",

    // Hero Section
    badge: isTamil ? "உங்கள் சுற்றுப்புறம், மேம்படுத்தப்பட்டது" : "Your Neighborhood, Upgraded",
    h1Main: isTamil ? "வெறுமனே பார்க்காதீர்கள்." : "Don’t Just Watch.",
    h1Sub: isTamil ? "மாற்றத்தை ஏற்படுத்துங்கள்." : "Drive Real Change.",
    heroDesc: isTamil ? "பாழடைந்த சாலைகள் மற்றும் புறக்கணிக்கப்பட்ட புகார்களால் சோர்வடைந்துவிட்டீர்களா? உங்கள் ஸ்மார்ட்போனை ஒரு குடிமை அதிகார மையமாக மாற்றவும். அதைக் கண்டறியவும், அடையாளப்படுத்தவும், தீர்வு கிடைப்பதைக் காணவும்." : "Tired of broken roads and ignored reports? Turn your smartphone into a civic powerhouse. Spot it, pin it, and witness the fix happen.",
    joinBtn: isTamil ? "இயக்கத்தில் இணையுங்கள்" : "Join the Movement",

    // How it works
    hiwTitle: isTamil ? "உங்கள் நகரத்தின் துடிப்பாக இருங்கள்" : "Be the Pulse of Your City",
    hiwDesc: isTamil ? "உங்கள் சுற்றுப்புறத்தை மாற்றுவது வெறும் கனவு மட்டுமல்ல—அது ஒரு 3-படி திட்டவரைபடம். உங்கள் உள்ளூர் நுண்ணறிவுகளை நிஜ உலக மாற்றமாக நாங்கள் எவ்வாறு மாற்றுகிறோம் என்பது இங்கே." : "Transforming your neighborhood isn't just a dream—it's a 3-step blueprint. Here is how we turn your local insights into real-world change.",
    step1Title: isTamil ? "தருணத்தைப் படம்பிடிக்கவும்" : "Capture the Moment",
    step1Desc: isTamil ? "கவனிக்கப்பட வேண்டிய ஒன்றைக் கண்டீர்களா? புகைப்படம் எடுக்கவும், ஜிபிஎஸ்ஸைக் குறிக்கவும், தரவுகள் கதையைச் சொல்லட்டும்." : "See something that needs love? Snap a photo, pin the GPS, and let the data tell the story.",
    
    // About Section
    aboutH1: isTamil ? "பார்ப்பதை நிறுத்துங்கள்." : "Stop Witnessing.",
    aboutH2: isTamil ? "தாக்கத்தை ஏற்படுத்துங்கள்." : "Start Impacting.",
    aboutP1: isTamil ? "நாம் அனைவரும் பார்த்திருக்கிறோம்: ஒருபோதும் நிரப்பப்படாத பள்ளம், வாரக்கணக்கில் இருட்டாக இருக்கும் தெருவிளக்குகள் மற்றும் புறக்கணிக்கப்பட்ட நீர் கசிவுகள். மௌனம் தான் சமூகங்களைத் தேக்கமடையச் செய்கிறது." : "We’ve all seen it: the pothole that never gets filled, the streetlights that stay dark for weeks, and the water leaks that go ignored. Silence is what keeps communities stuck.",
    aboutP2: isTamil ? "லோக்கல் இம்பாக்ட் லாக் என்பது வெறும் டேஷ்போர்டு மட்டுமல்ல; இது உங்கள் டிஜிட்டல் மெகாஃபோன்." : "Local Impact Log isn't just a dashboard; it's your digital megaphone."
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar: Glassmorphism with official Gold border */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-tvk-gold p-2 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.2)]">
               <MapPin className="h-5 w-5 text-tvk-dark" />
            </div>
            <span className="text-xl font-black tracking-tighter text-tvk-gold uppercase" style={{ fontFamily: 'Outfit' }}>TVK IMPACT LOG</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-tvk-gold transition-colors">{t.home}</a>
            <button onClick={() => navigate('/live-maps')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-tvk-gold">{t.liveMaps}</button>
            <button onClick={() => navigate('/impact-stats')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-tvk-gold">{t.impactStats}</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTamil(!isTamil)}
              className="px-3 py-1.5 border border-tvk-gold/30 rounded-3xl text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2 transition-all"
            >
              <Globe className="w-3 h-3" /> {isTamil ? "ENG" : "தமிழ்"}
            </button>
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-tvk-gold">
              {t.login}
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-tvk-gold hover:bg-yellow-400 text-tvk-dark text-[10px] font-black uppercase tracking-[0.2em] px-6 py-5 rounded-3xl transition-all shadow-lg shadow-yellow-500/10">
              {t.signup}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section: Centered for Authority */}
      <main id="home" className="pt-48 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 border border-tvk-gold/20 bg-tvk-gold/5 rounded-full">
            <span className="flex h-1.5 w-1.5 rounded-full bg-tvk-gold animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-tvk-gold/80">{t.badge}</span>
          </div>

          <h1 className="text-xl md:text-xl lg:text-5xl font-black text-white bold mb-8 leading-[0.85] tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
            {t.h1Main} <br />
            <span className="bg-gradient-to-b from-yellow-200 via-tvk-gold to-yellow-700 bg-clip-text text-transparent">
              {t.h1Sub}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            {t.heroDesc}
          </p>

          <Button 
            onClick={() => navigate('/signup')}
            className="group bg-tvk-gold hover:bg-yellow-400 text-tvk-dark px-12 py-8 text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)]"
          >
            {t.joinBtn} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>

          {/* Impact Stats Grid: Professional Card Style */}
          {/* <div className="mt-32 grid grid-cols-1 md:grid-cols-3 border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            {[
              { label: isTamil ? "தீர்க்கப்பட்டவை" : "Issues Solved", val: '2.4k' },
              { label: isTamil ? "உறுப்பினர்கள்" : "Members", val: '15k' },
              { label: isTamil ? "நகரங்கள்" : "Cities", val: '12' },
            ].map((stat, i) => (
              <div key={i} className="py-12 border-r border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-[10px] font-bold text-tvk-gold/60 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </main>

      {/* Blueprint Section: How It Works */}
      <section id="how-it-works" className="py-32 bg-black/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">{t.hiwTitle}</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto font-medium">{t.hiwDesc}</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
             <FeatureCard num="01" title={t.step1Title} desc={t.step1Desc} icon={<MapPin className="text-tvk-gold h-8 w-8" />} />
             <FeatureCard num="02" title={isTamil ? "சரிபார்க்கப்பட்டது" : "Verified"} desc={isTamil ? "உங்கள் குரல் நேரடியாக அதிகாரிகளிடம் கொண்டு செல்லப்படும்." : "Routes your voice to those who can help."} icon={<Shield className="text-tvk-gold h-8 w-8" />} />
             <FeatureCard num="03" title={isTamil ? "தீர்வு" : "Witness"} desc={isTamil ? "மாற்றத்தை நேரலையில் கண்காணித்து கொண்டாடுங்கள்." : "Track the momentum in real-time."} icon={<TrendingUp className="text-tvk-gold h-8 w-8" />} />
          </div>
        </div>
      </section>

      {/* About Section: The Narrative */}
      <section id="about" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-light text-white mb-10 leading-tight">
              {t.aboutH1} <br />
              <span className="font-black text-tvk-gold italic">{t.aboutH2}</span>
            </h2>
            <div className="space-y-8 text-lg text-gray-400 leading-relaxed font-medium">
              <p>{t.aboutP1}</p>
              <p>{t.aboutP2}</p>
            </div>
            
            <div className="mt-12 group flex items-center gap-6 p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="bg-tvk-gold/10 p-4 rounded-xl group-hover:bg-tvk-gold group-hover:text-tvk-dark transition-all">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg uppercase tracking-tight">{isTamil ? "கூட்டணி" : "The Coalition"}</h3>
                <p className="text-gray-500 text-sm font-medium">{isTamil ? "ஒரே லட்சியத்தின் கீழ் அனைவரையும் இணைத்தல்." : "Uniting civic changemakers under one mission."}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square bg-gradient-to-br from-tvk-maroon to-black border border-white/5 flex items-center justify-center overflow-hidden">
             {/* Decorative brand background element */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <MapPin className="w-40 h-40 text-tvk-gold/20" />
             <div className="absolute bottom-10 left-10 text-left">
                <div className="text-5xl font-black text-tvk-gold">LIVE</div>
                <div className="text-sm font-bold uppercase tracking-[0.4em] text-white/40">IMPACT MAP</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-tvk-dark text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-tvk-gold font-black tracking-tighter uppercase text-2xl">TVK IMPACT LOG</span>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-600 italic">
            பிறப்பொக்கும் எல்லா உயிர்க்கும்
          </p>
          <div className="mt-12 h-[1px] w-20 bg-tvk-gold/30 mx-auto"></div>
          <p className="mt-12 text-[9px] font-black text-gray-700 tracking-[0.3em] uppercase">
            © {new Date().getFullYear()} TAMILAGA VETTRI KALAGAZHAM • TVK Impact
          </p>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Blueprint Cards
function FeatureCard({ num, title, desc, icon }) {
  return (
    <div className="group p-10 border border-white/5 bg-white/[0.01] hover:border-tvk-gold/30 transition-all">
      <div className="flex justify-between items-start mb-10">
        <div className="p-4 bg-tvk-gold/10 rounded-xl group-hover:bg-tvk-gold group-hover:text-tvk-dark transition-all">
          {icon}
        </div>
        <span className="text-4xl font-black text-white/5 group-hover:text-tvk-gold/10 transition-colors uppercase italic">{num}</span>
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-tvk-gold transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}