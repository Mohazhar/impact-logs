import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../../src/lib/api'; 

export default function ImpactStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTamil, setIsTamil] = useState(true);

  const t = {
    back: isTamil ? "முகப்பு" : "Home",
    title: isTamil ? "சமூக தாக்கம்" : "Community Impact",
    subtitle: isTamil ? "உள்கட்டமைப்பு மற்றும் பாதுகாப்பை மேம்படுத்துவதில் நமது கூட்டு முன்னேற்றம்." : "Quantifying our collective progress in restoring local infrastructure and neighborhood safety.",
    loading: isTamil ? "தரவுகள் சேகரிக்கப்படுகின்றன..." : "Aggregating Global Data...",
    total: isTamil ? "மொத்த அறிக்கைகள்" : "Total Reports",
    progress: isTamil ? "செயல்பாட்டில்" : "In Progress",
    resolved: isTamil ? "தீர்க்கப்பட்டவை" : "Resolved",
    success: isTamil ? "வெற்றி விகிதம்" : "Success Rate",
    sector: isTamil ? "துறை வாரியான பகிர்வு" : "Sector Distribution",
    collectiveTitle: isTamil ? "கூட்டுத் தாக்கம்" : "Collective Impact",
    join: isTamil ? "இயக்கத்தில் இணையுங்கள்" : "Join the Movement",
    protocol: isTamil ? "செயல்முறை விதிகள்" : "Mission Protocol"
  };

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/public/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen text-white">
      {/* Navbar: TVK Prestige Style */}
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
                <BarChart3 className="h-6 w-6 text-tvk-gold shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                <span className="text-xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
                  IMPACT <span className="text-tvk-gold">LOG</span>
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
              <Button onClick={() => navigate('/signup')} className="bg-tvk-gold hover:bg-yellow-400 text-black rounded-none font-black text-[10px] tracking-widest px-6 h-11 uppercase transition-all shadow-lg shadow-yellow-500/10">
                {t.join}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 border-l-4 border-tvk-gold pl-8">
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
            {t.title}
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-black/20 border border-white/5 backdrop-blur-sm">
            <Loader2 className="h-12 w-12 text-tvk-gold animate-spin mb-6" />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">{t.loading}</p>
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics: Prestige Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 mb-12 bg-white/5 border border-white/5 p-1">
              <MetricCard 
                icon={<BarChart3 className="text-tvk-gold" />} 
                label={t.total} 
                value={stats.total_reports} 
              />
              <MetricCard 
                icon={<Clock className="text-tvk-gold" />} 
                label={t.progress} 
                value={stats.solving} 
              />
              <MetricCard 
                icon={<CheckCircle2 className="text-tvk-gold" />} 
                label={t.resolved} 
                value={stats.solved} 
              />
              <MetricCard 
                icon={<TrendingUp className="text-tvk-gold" />} 
                label={t.success} 
                value={`${stats.resolution_rate}%`} 
              />
            </div>

            {/* Sector Distribution: Minimalist Visualization */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-12 mb-12">
              <h3 className="text-2xl font-black text-white mb-12 uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>
                {t.sector}
              </h3>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                {Object.entries(stats.categories).map(([category, count]) => {
                  const percentage = (count / stats.total_reports * 100).toFixed(1);
                  return (
                    <div key={category} className="group">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-bold text-gray-300 uppercase text-xs tracking-widest">{category}</span>
                        <span className="text-[10px] font-black text-tvk-gold uppercase">{count} LOGS</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 overflow-hidden">
                        <div
                          className="bg-tvk-gold h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-1">
              {/* Collective Impact Card */}
              <div className="bg-tvk-maroon p-12 text-white relative overflow-hidden group border border-white/5">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp size={240} />
                </div>
                <h3 className="text-3xl font-black mb-6 relative z-10 uppercase tracking-tighter">{t.collectiveTitle}</h3>
                <p className="text-gray-300 mb-10 text-lg leading-relaxed relative z-10">
                  {isTamil ? (
                    <>நமது சமூகம் <strong>{stats.total_reports}</strong> உள்கட்டமைப்புத் தேவைகளை ஆவணப்படுத்தியுள்ளது. இதில் <strong>{stats.solved}</strong> சிக்கல்களைத் தீர்ப்பதன் மூலம், உள்ளூர் பாதுகாப்பை நேரடியாக மேம்படுத்தியுள்ளோம்.</>
                  ) : (
                    <>Our community has documented <strong>{stats.total_reports}</strong> instances of infrastructure need. By closing <strong>{stats.solved}</strong> of these, we've directly improved local safety.</>
                  )}
                </p>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-tvk-gold hover:bg-white text-black rounded-none font-black px-10 h-14 transition-all relative z-10 uppercase text-[10px] tracking-widest"
                >
                  {t.join}
                </Button>
              </div>

              {/* Mission Protocol Card */}
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 p-12 shadow-2xl">
                <h3 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">{t.protocol}</h3>
                <ul className="space-y-6">
                  <ProtocolItem text={isTamil ? "குடிமக்கள் துல்லியமான GPS மூலம் புகார்களைப் பதிவு செய்கிறார்கள்" : "Citizens report with high-precision GPS telemetry"} />
                  <ProtocolItem text={isTamil ? "வட்டார நிர்வாகிகள் புகார்களைச் சரிபார்த்து தணிக்கை செய்கிறார்கள்" : "Regional administrators verify and audit reports"} />
                  <ProtocolItem text={isTamil ? "நேரலை வரைபடங்கள் மூலம் நிகழ்நேர கண்காணிப்பு" : "Real-time status tracking via Live Maps"} />
                  <ProtocolItem text={isTamil ? "இறுதி தீர்வு பொது காப்பகத்தில் ஆவணப்படுத்தப்படுகிறது" : "Final resolution documented and publicly archived"} />
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-black/20 border border-white/5">
            <AlertTriangle className="h-20 w-20 text-tvk-gold mx-auto mb-6 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Protocol Error: Connection Failed</p>
            <Button onClick={fetchStats} variant="outline" className="mt-8 rounded-none border-tvk-gold/50 text-tvk-gold hover:bg-tvk-gold hover:text-black font-black uppercase text-[10px] tracking-widest px-8">
              Retry Connection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-black/40 py-12 px-8 transition-all hover:bg-tvk-maroon/20">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="bg-tvk-gold/10 p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.1)]">{icon}</div>
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{label}</p>
          <p className="text-5xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Outfit' }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProtocolItem({ text }) {
  return (
    <li className="flex items-start gap-5 group">
      <div className="bg-tvk-gold/10 p-1 group-hover:bg-tvk-gold group-hover:text-black transition-all">
        <CheckCircle2 className="h-5 w-5 text-tvk-gold group-hover:text-inherit" />
      </div>
      <span className="text-gray-400 font-medium text-lg leading-tight group-hover:text-white transition-colors">{text}</span>
    </li>
  );
}