import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ImpactStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/public/stats`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-emerald-700" />
                <span className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Impact Stats</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/login')} variant="ghost">Login</Button>
              <Button onClick={() => navigate('/signup')} className="bg-emerald-700 hover:bg-emerald-800 text-white">Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-3" style={{ fontFamily: 'Outfit' }}>Community Impact Statistics</h1>
          <p className="text-lg text-slate-600">Track the progress and impact of community-reported issues</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Reports</p>
                    <p className="text-3xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>{stats.total_reports}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: 'Outfit' }}>{stats.solving}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Resolved</p>
                    <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: 'Outfit' }}>{stats.solved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Resolution Rate</p>
                    <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: 'Outfit' }}>{stats.resolution_rate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-8">
              <h3 className="text-2xl font-bold text-slate-700 mb-6" style={{ fontFamily: 'Outfit' }}>Reports by Category</h3>
              <div className="space-y-4">
                {Object.entries(stats.categories).map(([category, count]) => {
                  const percentage = (count / stats.total_reports * 100).toFixed(1);
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-700">{category}</span>
                        <span className="text-sm text-slate-600">{count} reports ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div
                          className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impact Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-sm border border-emerald-200 p-8">
                <h3 className="text-2xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>Community Impact</h3>
                <p className="text-slate-600 mb-6">
                  Our community has reported <strong>{stats.total_reports}</strong> infrastructure issues, 
                  with <strong>{stats.solved}</strong> successfully resolved. Together, we're making our 
                  neighborhoods safer and better for everyone.
                </p>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Join the Movement
                </Button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-200 p-8">
                <h3 className="text-2xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>How It Works</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <span>Citizens report issues with GPS precision</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <span>Administrators review and verify reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <span>Real-time status updates keep you informed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <span>Track progress until issues are resolved</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Unable to load statistics</p>
          </div>
        )}
      </div>
    </div>
  );
}