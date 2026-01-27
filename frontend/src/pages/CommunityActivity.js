import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MapPin, Clock, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../../src/lib/api'; // Senior Developer Fix: Use our unified axios instance

export default function CommunityActivity() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize the fetch function to stabilize dependencies
  const fetchLogs = useCallback(async () => {
    try {
      // Fixed: Removed manual URL construction to prevent double slashes //
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
    const interval = setInterval(fetchLogs, 10000); // 10s refresh for live feel
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Solving': return 'text-amber-700 bg-amber-50 border-amber-100';
      default: return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </button>
              <div className="h-4 w-px bg-stone-200" />
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-700" />
                <span className="text-lg font-black text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>Live Feed</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/login')} variant="ghost" className="font-bold text-sm">Login</Button>
              <Button onClick={() => navigate('/signup')} className="bg-emerald-700 hover:bg-slate-900 text-white rounded-full font-bold text-sm px-6">Join Movement</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>Community Pulse</h1>
          <p className="text-lg text-slate-500 font-medium">Real-time chronicle of impact reports from verified citizens.</p>
        </div>

        {/* Stats Banner */}
        <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 mb-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Activity size={120} />
          </div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>Collective Vigilance</h2>
          </div>
          <p className="text-slate-400 text-lg max-w-xl">
            Monitoring <strong>{logs.length}+</strong> active infrastructure reports across the region. Every report is a step toward a better neighborhood.
          </p>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Recent Submissions</h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Updates Active</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Feed...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-stone-100 bg-stone-50/30 hover:bg-white hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`p-4 rounded-xl border-2 shrink-0 ${getStatusColor(log.status)}`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-lg truncate leading-tight">{log.name}</h4>
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                           <Activity size={12} />
                           {log.locality}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4 font-medium italic">"{log.description}"</p>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(log.created_at)}
                      </span>
                      <span className="bg-stone-200/50 px-2 py-0.5 rounded text-slate-500">{log.category}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {logs.length === 0 && (
                <div className="text-center py-20">
                   <Activity className="h-12 w-12 text-stone-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No recent activity detected</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-emerald-50 rounded-[2rem] border border-emerald-100 p-10 text-center shadow-sm">
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight" style={{ fontFamily: 'Outfit' }}>Observe a Problem?</h3>
          <p className="text-slate-600 mb-8 font-medium text-lg max-w-lg mx-auto">Help your neighbors by providing high-precision reports on infrastructure status.</p>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-emerald-700 hover:bg-slate-900 text-white px-10 h-14 rounded-full text-lg font-bold shadow-xl transition-all"
          >
            Submit Incident Report
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}