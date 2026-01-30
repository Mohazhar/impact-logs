import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, Star, TrendingUp, Flame, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [isTamil, setIsTamil] = useState(true);

  // Content Strings
  const t = {
    back: isTamil ? "முகப்பு" : "Home",
    title: isTamil ? "தாக்க முன்னிலை அட்டவணை" : "Impact Leaderboard",
    subtitle: isTamil ? "நமது சமூகத்தில் மாற்றத்தை ஏற்படுத்தும் குடிமக்களை அங்கீகரித்தல்." : "Recognizing the citizens driving change in our community.",
    points: isTamil ? "தாக்க புள்ளிகள்" : "Impact Points",
    logs: isTamil ? "பதிவுகள்" : "Logs",
    rankUser: isTamil ? "தரம் மற்றும் பயனர்" : "Rank & User",
    ctaTitle: isTamil ? "தரவரிசையில் உயரத் தயாரா?" : "Ready to climb the ranks?",
    ctaSub: isTamil ? "இன்றே ஒரு சிக்கலைப் பதிவுசெய்து புள்ளிகளைப் பெறத் தொடங்குங்கள்." : "Report an issue today and start earning impact points.",
    ctaBtn: isTamil ? "புதிய தாக்கத்தைப் பதிவு செய்க" : "Log New Impact"
  };

  const topPerformers = [
    { id: 1, name: "Alex Rivera", points: 2840, logs: 42, badge: isTamil ? "சமூக நாயகன்" : "Community Hero", rank: 2 },
    { id: 2, name: "Sarah Chen", points: 3150, logs: 56, badge: isTamil ? "தாக்க சாதனையாளர்" : "Impact Legend", rank: 1 },
    { id: 3, name: "Marcus Thorne", points: 2100, logs: 31, badge: isTamil ? "நிலையான பங்களிப்பாளர்" : "Steady Contributor", rank: 3 },
  ];

  const others = [
    { id: 4, name: "Elena Rodriguez", points: 1850, logs: 24 },
    { id: 5, name: "Jordan Smith", points: 1620, logs: 19 },
    { id: 6, name: "Sam Wilson", points: 1400, logs: 15 },
    { id: 7, name: "Priya Patel", points: 1250, logs: 12 },
  ];

  return (
    <div className="min-h-screen text-white selection:bg-tvk-gold selection:text-black">
      {/* Navbar: TVK Style */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-gray-400 hover:text-tvk-gold font-black text-[10px] uppercase tracking-widest transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> {t.back}
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTamil(!isTamil)}
              className="px-3 py-1.5 border border-tvk-gold/30 rounded text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2"
            >
              <Globe className="w-3 h-3" /> {isTamil ? "ENG" : "தமிழ்"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header: Centered Prestige */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-4 bg-tvk-gold/10 border border-tvk-gold/20 rounded-full mb-8 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <Trophy className="h-10 w-10 text-tvk-gold" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4" style={{ fontFamily: 'Outfit' }}>
            {t.title}
          </h1>
          <p className="text-xl text-gray-400 font-medium">{t.subtitle}</p>
        </div>

        {/* Top 3 Podium: TVK Prestige Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 items-end mb-16">
          {topPerformers.sort((a, b) => a.rank - b.rank).map((user) => (
            <div 
              key={user.id} 
              className={`relative bg-black/40 backdrop-blur-md border border-white/10 p-8 text-center transition-all hover:border-tvk-gold/50 hover:-translate-y-2 duration-500 ${
                user.rank === 1 
                  ? 'h-[400px] border-tvk-gold/30 shadow-[0_0_50px_rgba(234,179,8,0.05)] z-10' 
                  : 'h-80 opacity-80'
              }`}
            >
              {user.rank === 1 && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-tvk-gold text-black p-3 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  <Star className="fill-current" size={24} />
                </div>
              )}
              
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-black text-tvk-gold shadow-inner">
                {user.name.charAt(0)}
              </div>
              
              <h3 className="font-black text-white text-2xl tracking-tighter uppercase mb-1">{user.name}</h3>
              <p className="text-tvk-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-8">{user.badge}</p>
              
              <div className="text-5xl font-black text-white tracking-tighter italic">{user.points}</div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">{t.points}</p>
            </div>
          ))}
        </div>

        {/* Rest of the List: Minimalist Audit Table */}
        <div className="bg-white/[0.03] border border-white/5 backdrop-blur-sm overflow-hidden mb-16">
          <div className="p-8 border-b border-white/5 flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <span>{t.rankUser}</span>
            <div className="flex gap-16">
              <span>{t.logs}</span>
              <span>{t.points}</span>
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {others.map((user, index) => (
              <div key={user.id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-6">
                  <span className="text-xl font-black text-white/10 group-hover:text-tvk-gold/20 transition-colors w-8 italic">#{index + 4}</span>
                  <div className="w-12 h-12 bg-tvk-maroon/40 border border-white/5 rounded-full flex items-center justify-center font-black text-tvk-gold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-black text-white uppercase tracking-tight text-lg group-hover:text-tvk-gold transition-colors">{user.name}</span>
                </div>
                
                <div className="flex gap-16 items-center">
                  <span className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <Flame size={16} className="text-tvk-gold" /> {user.logs}
                  </span>
                  <span className="text-white font-black text-2xl w-20 text-right italic tracking-tighter">
                    {user.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA: High-Impact Gold Banner */}
        <div className="mt-12 p-12 bg-tvk-gold text-black flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
          <div className="z-10 text-center md:text-left relative">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{t.ctaTitle}</h3>
            <p className="text-maroon-900 font-bold">{t.ctaSub}</p>
          </div>
          <button 
            onClick={() => navigate('/signup')}
            className="z-10 bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] px-10 py-5 rounded-none hover:bg-tvk-maroon transition-all shadow-2xl active:scale-95"
          >
            {t.ctaBtn}
          </button>
          <TrendingUp className="absolute -right-10 -bottom-10 h-64 w-64 text-black/5" />
        </div>

        {/* Brand Slogan */}
        <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
          பிறப்பொக்கும் எல்லா உயிர்க்கும்
        </p>
      </div>
    </div>
  );
}