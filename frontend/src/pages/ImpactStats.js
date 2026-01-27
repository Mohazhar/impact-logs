import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../../src/lib/api'; // Senior Developer Fix: Use our unified axios instance

export default function ImpactStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize fetch to prevent unnecessary re-renders
  const fetchStats = useCallback(async () => {
    try {
      // Fixed: Removed `${API_URL}/api` to prevent double slashes
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
                <BarChart3 className="h-5 w-5 text-emerald-700" />
                <span className="text-lg font-black text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>Impact Analytics</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>Community Impact</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">Quantifying our collective progress in restoring local infrastructure and neighborhood safety.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-stone-100 shadow-xl">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aggregating Global Data...</p>
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <MetricCard 
                icon={<BarChart3 className="text-blue-600" />} 
                bg="bg-blue-50" 
                label="Total Reports" 
                value={stats.total_reports} 
              />
              <MetricCard 
                icon={<Clock className="text-amber-600" />} 
                bg="bg-amber-50" 
                label="In Progress" 
                value={stats.solving} 
                color="text-amber-600"
              />
              <MetricCard 
                icon={<CheckCircle2 className="text-emerald-600" />} 
                bg="bg-emerald-50" 
                label="Resolved" 
                value={stats.solved} 
                color="text-emerald-600"
              />
              <MetricCard 
                icon={<TrendingUp className="text-emerald-600" />} 
                bg="bg-emerald-50" 
                label="Success Rate" 
                value={`${stats.resolution_rate}%`} 
                color="text-emerald-600"
              />
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-10 mb-10">
              <h3 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Outfit' }}>Sector Distribution</h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {Object.entries(stats.categories).map(([category, count]) => {
                  const percentage = (count / stats.total_reports * 100).toFixed(1);
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-700">{category}</span>
                        <span className="text-xs font-black text-slate-400 uppercase">{count} Reports</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <TrendingUp size={120} />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Collective Impact</h3>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed relative z-10">
                  Our community has documented <strong>{stats.total_reports}</strong> instances of infrastructure need. 
                  By closing <strong>{stats.solved}</strong> of these, we've directly improved local safety.
                </p>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-emerald-500 hover:bg-white hover:text-slate-900 text-white rounded-full font-bold px-8 h-12 transition-all relative z-10"
                >
                  Join the Movement
                </Button>
              </div>

              <div className="bg-white rounded-[2rem] border border-stone-100 p-10 shadow-xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Mission Protocol</h3>
                <ul className="space-y-4">
                  <ProtocolItem text="Citizens report with high-precision GPS telemetry" />
                  <ProtocolItem text="Regional administrators verify and audit reports" />
                  <ProtocolItem text="Real-time status tracking via Live Maps" />
                  <ProtocolItem text="Final resolution documented and publicly archived" />
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-stone-100 shadow-xl">
            <AlertTriangle className="h-16 w-16 text-amber-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Protocol Error: Unable to Load Metrics</p>
            <Button onClick={fetchStats} variant="outline" className="mt-6 rounded-full border-2">Retry Connection</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components for cleaner structure
function MetricCard({ icon, bg, label, value, color = "text-slate-700" }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 transition-all hover:shadow-lg">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`${bg} p-4 rounded-2xl`}>{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-4xl font-black ${color} tracking-tighter`} style={{ fontFamily: 'Outfit' }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProtocolItem({ text }) {
  return (
    <li className="flex items-start gap-4 group">
      <div className="bg-emerald-50 p-1 rounded-md group-hover:bg-emerald-500 group-hover:text-white transition-colors">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <span className="text-slate-600 font-medium">{text}</span>
    </li>
  );
}