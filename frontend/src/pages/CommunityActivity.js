import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MapPin, Clock, ArrowLeft, Sparkles, Loader2, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../../src/lib/api'; 

export default function CommunityActivity() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTamil, setIsTamil] = useState(true);

  // Bilingual Content Dictionary
  const t = {
    back: isTamil ? "முகப்பு" : "Home",
    liveFeed: isTamil ? "நேரலை ஊட்டம்" : "Live Feed",
    join: isTamil ? "இயக்கத்தில் இணையுங்கள்" : "Join Movement",
    login: isTamil ? "உள்நுழை" : "Login",
    title: isTamil ? "சமூக துடிப்பு" : "Community Pulse",
    subtitle: isTamil ? "உறுதிப்படுத்தப்பட்ட குடிமக்களின் தாக்க அறிக்கைகளின் நேரலை தொகுப்பு." : "Real-time chronicle of impact reports from verified citizens.",
    vigilanceTitle: isTamil ? "கூட்டு விழிப்புணர்வு" : "Collective Vigilance",
    vigilanceDesc: isTamil ? "மண்டலம் முழுவதும் பல உள்கட்டமைப்பு அறிக்கைகளை கண்காணித்தல். ஒவ்வொரு அறிக்கையும் சிறந்த சுற்றுப்புறத்தை நோக்கிய ஒரு படியாகும்." : "Monitoring active infrastructure reports across the region. Every report is a step toward a better neighborhood.",
    recentTitle: isTamil ? "சமீபத்திய சமர்ப்பிப்புகள்" : "Recent Submissions",
    liveUpdates: isTamil ? "நேரலை அறிவிப்புகள் செயல்பாட்டில் உள்ளன" : "Live Updates Active",
    sync: isTamil ? "ஊட்டம் ஒத்திசைக்கப்படுகிறது..." : "Synchronizing Feed...",
    noActivity: isTamil ? "சமீபத்திய செயல்பாடுகள் எதுவும் கண்டறியப்படவில்லை" : "No recent activity detected",
    ctaTitle: isTamil ? "சிக்கலை கவனிக்கிறீர்களா?" : "Observe a Problem?",
    ctaDesc: isTamil ? "உள்கட்டமைப்பு நிலை குறித்த துல்லியமான அறிக்கைகளை வழங்குவதன் மூலம் உங்கள் அண்டை வீட்டாருக்கு உதவுங்கள்." : "Help your neighbors by providing high-precision reports on infrastructure status.",
    submitBtn: isTamil ? "சம்பவ அறிக்கையை சமர்ப்பிக்கவும்" : "Submit Incident Report"
  };

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get('/public/impact-logs');
      setLogs(data.slice(0, 50));
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); 
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Solved': return 'text-green-500 border-green-500/30 bg-green-500/5';
      case 'Solving': return 'text-tvk-gold border-tvk-gold/30 bg-tvk-gold/5';
      default: return 'text-gray-400 border-white/10 bg-white/5';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return isTamil ? 'இப்போது' : 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}${isTamil ? 'நிமி' : 'm'} ${isTamil ? 'முன்' : 'ago'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}${isTamil ? 'மணி' : 'h'} ${isTamil ? 'முன்' : 'ago'}`;
    return `${Math.floor(seconds / 86400)}${isTamil ? 'நாட்களுக்கு' : 'd'} ${isTamil ? 'முன்' : 'ago'}`;
  };

  return (
    <div className="min-h-screen text-white selection:bg-tvk-gold selection:text-black">
      {/* Navbar: Glassmorphism */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 text-gray-400 hover:text-tvk-gold transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>{t.back}</span>
              </button>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-tvk-gold" />
                <span className="text-xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
                  {t.liveFeed}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsTamil(!isTamil)}
                className="px-3 py-1.5 border border-tvk-gold/30 rounded text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2"
              >
                <Globe className="w-3 h-3" /> {isTamil ? "ENG" : "தமிழ்"}
              </button>
              <Button onClick={() => navigate('/login')} variant="ghost" className="text-white font-bold text-[10px] uppercase tracking-widest">{t.login}</Button>
              <Button onClick={() => navigate('/signup')} className="bg-tvk-gold hover:bg-yellow-400 text-black rounded-none font-black text-[10px] tracking-widest px-6 h-11 uppercase shadow-lg shadow-yellow-500/10">
                {t.join}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="mb-12 border-l-4 border-tvk-gold pl-8">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
            {t.title}
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Collective Vigilance Banner */}
        <div className="bg-tvk-maroon rounded-none border border-white/5 shadow-2xl p-10 mb-12 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Activity size={240} />
          </div>
          <div className="relative z-10 flex items-center gap-5 mb-6">
            <div className="bg-tvk-gold p-3 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Outfit' }}>{t.vigilanceTitle}</h2>
          </div>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed font-medium">
             {t.vigilanceDesc.split(logs.length).map((part, i) => (
               <React.Fragment key={i}>
                 {part}{i === 0 && <strong className="text-tvk-gold text-2xl mx-1">{logs.length}+</strong>}
               </React.Fragment>
             ))}
          </p>
        </div>

        {/* Activity Feed Container */}
        <div className="bg-white/[0.03] backdrop-blur-md rounded-none border border-white/5 p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Outfit' }}>{t.recentTitle}</h3>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-tvk-gold rounded-full animate-pulse shadow-[0_0_10px_#EAB308]" />
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{t.liveUpdates}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-12 w-12 text-tvk-gold animate-spin mb-6" />
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">{t.sync}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-6 p-8 bg-black/20 border border-white/5 hover:border-tvk-gold/30 hover:bg-tvk-maroon/10 transition-all duration-500 group"
                  style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                >
                  <div className={`p-4 rounded-none border shrink-0 transition-all group-hover:bg-tvk-gold group-hover:text-black ${getStatusStyle(log.status)}`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4 gap-6">
                      <div>
                        <h4 className="font-black text-white text-2xl tracking-tighter uppercase leading-tight group-hover:text-tvk-gold transition-colors">{log.name}</h4>
                        <p className="text-xs font-bold text-tvk-gold/60 flex items-center gap-2 mt-2 uppercase tracking-widest">
                           <Activity size={14} />
                           {log.locality}
                        </p>
                      </div>
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${getStatusStyle(log.status)}`}>
                        {isTamil ? (log.status === 'Solved' ? "தீர்க்கப்பட்டது" : "செயல்பாட்டில்") : log.status}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-6 font-medium italic text-lg">"{log.description}"</p>
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-tvk-gold" />
                        {getTimeAgo(log.created_at)}
                      </span>
                      <span className="bg-white/5 border border-white/5 px-3 py-1 text-gray-400">{log.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {logs.length === 0 && (
                <div className="text-center py-32 opacity-20">
                   <Activity className="h-16 w-16 text-white mx-auto mb-6" />
                   <p className="text-white font-black uppercase tracking-[0.4em] text-xs">{t.noActivity}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Section: Gold Impact */}
        <div className="mt-12 bg-tvk-gold p-12 text-center shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <h3 className="text-4xl font-black text-black mb-6 tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>{t.ctaTitle}</h3>
          <p className="text-maroon-900 mb-10 font-bold text-xl max-w-lg mx-auto leading-tight">{t.ctaDesc}</p>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-black hover:bg-tvk-maroon text-white px-12 h-16 rounded-none text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95"
          >
            {t.submitBtn}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}