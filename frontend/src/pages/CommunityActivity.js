import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, MapPin, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function CommunityActivity() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/public/impact-logs`);
      setLogs(data.slice(0, 50));
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-emerald-700 bg-emerald-100';
      case 'Solving': return 'text-amber-700 bg-amber-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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
                <Activity className="h-6 w-6 text-emerald-700" />
                <span className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Community Activity</span>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-3" style={{ fontFamily: 'Outfit' }}>Recent Community Activity</h1>
          <p className="text-lg text-slate-600">Live feed of impact reports from citizens across the community</p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-8 w-8" />
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>Citizens Taking Action</h2>
          </div>
          <p className="text-emerald-50">Join {logs.length}+ community members making a difference in their neighborhoods</p>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h3 className="text-xl font-bold text-slate-700 mb-6" style={{ fontFamily: 'Outfit' }}>Latest Reports</h3>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-stone-200 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`p-3 rounded-full ${getStatusColor(log.status)}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-700">{log.name}</h4>
                        <p className="text-sm text-slate-600">{log.locality}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{log.description.substring(0, 150)}{log.description.length > 150 ? '...' : ''}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(log.created_at)}
                      </span>
                      <span>{log.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-stone-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-700 mb-3" style={{ fontFamily: 'Outfit' }}>See an Issue in Your Area?</h3>
          <p className="text-slate-600 mb-6">Help improve your community by reporting infrastructure problems</p>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-6 text-lg"
          >
            Start Reporting Issues
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}