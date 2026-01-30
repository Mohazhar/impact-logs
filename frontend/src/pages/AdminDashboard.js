import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { impactLogsAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Shield, LogOut, Filter, MapPin, User, Globe, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'Road', 'Water', 'Sanitation', 'Electricity', 'Other'];
const STATUSES = ['All', 'Solving', 'Solved', 'Fake'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isTamil, setIsTamil] = useState(false);
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const t = {
    title: isTamil ? "நிர்வாகக் கட்டுப்பாட்டு மையம்" : "Admin Command Center",
    logout: isTamil ? "வெளியேறு" : "Logout",
    total: isTamil ? "மொத்த அறிக்கைகள்" : "Total Reports",
    progress: isTamil ? "செயல்பாட்டில்" : "In Progress",
    resolved: isTamil ? "தீர்க்கப்பட்டவை" : "Resolved",
    fake: isTamil ? "தவறானவை" : "Flagged Fake",
    filters: isTamil ? "தேடல் வடிப்பான்கள்" : "Search Filters",
    feed: isTamil ? "தாக்க ஊட்டம்" : "Impact Feed",
    detail: isTamil ? "விரிவான பார்வை" : "Detail View",
    command: isTamil ? "தீர்வு கட்டளை" : "Resolution Command"
  };

  const fetchLogs = useCallback(async () => {
    try {
      const data = await impactLogsAPI.getAllLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Failed to fetch logs');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const applyFilters = useCallback(() => {
    let filtered = [...logs];
    if (filterCategory !== 'All') filtered = filtered.filter((log) => log.category === filterCategory);
    if (filterStatus !== 'All') filtered = filtered.filter((log) => log.status === filterStatus);
    if (filterDate) filtered = filtered.filter((log) => log.impact_date === filterDate);
    setFilteredLogs(filtered);
  }, [logs, filterCategory, filterStatus, filterDate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleStatusUpdate = async (logId, newStatus) => {
    try {
      await impactLogsAPI.updateStatus(logId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      setLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === logId ? { ...log, status: newStatus } : log))
      );
      if (selectedLog?.id === logId) setSelectedLog({ ...selectedLog, status: newStatus });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Solved': return 'border-green-500 text-green-500 bg-green-500/10';
      case 'Solving': return 'border-tvk-gold text-tvk-gold bg-tvk-gold/10';
      case 'Fake': return 'border-red-500 text-red-500 bg-red-500/10';
      default: return 'border-gray-500 text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-tvk-gold selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-tvk-gold p-1.5 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Shield className="h-6 w-6 text-tvk-dark" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">{t.title}</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsTamil(!isTamil)} className="text-[10px] font-bold text-tvk-gold flex items-center gap-2 uppercase tracking-widest border border-tvk-gold/30 px-3 py-1.5">
              <Globe className="w-3 h-3" /> {isTamil ? "ENG" : "தமிழ்"}
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-tvk-gold" />
              <span className="text-xs font-black uppercase tracking-widest">{profile?.name || 'Admin'}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest">
              <LogOut className="h-4 w-4 mr-2" /> {t.logout}
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-12 border border-white/5 bg-white/5 p-1">
          <MetricBox label={t.total} val={logs.length} color="text-white" />
          <MetricBox label={t.progress} val={logs.filter(l => l.status === 'Solving').length} color="text-tvk-gold" />
          <MetricBox label={t.resolved} val={logs.filter(l => l.status === 'Solved').length} color="text-green-500" />
          <MetricBox label={t.fake} val={logs.filter(l => l.status === 'Fake').length} color="text-red-500" />
        </div>

        {/* Search Panel */}
        <div className="bg-black/40 backdrop-blur-md border border-white/5 p-8 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="h-5 w-5 text-tvk-gold" />
            <h3 className="text-sm font-black uppercase tracking-widest">{t.filters}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FilterField label="Category" val={filterCategory} setVal={setFilterCategory} options={CATEGORIES} />
            <FilterField label="Status" val={filterStatus} setVal={setFilterStatus} options={STATUSES} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full bg-white/5 border border-white/10 text-xs h-10 px-3 focus:border-tvk-gold outline-none" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-1 items-start">
          {/* List Section */}
          <div className="bg-black/20 border border-white/5 p-8 h-[800px] overflow-hidden flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-8">{t.feed} ({filteredLogs.length})</h3>
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                <Loader2 className="h-10 w-10 animate-spin text-tvk-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing...</span>
              </div>
            ) : (
              <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                {filteredLogs.map(log => (
                  <div key={log.id} onClick={() => setSelectedLog(log)} className={`p-6 border cursor-pointer transition-all ${selectedLog?.id === log.id ? 'bg-tvk-maroon/30 border-tvk-gold' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-white uppercase tracking-tight">{log.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mt-2">
                          <MapPin className="h-3 w-3 text-tvk-gold" /> {log.locality}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(log.status)}`}>{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-12 min-h-[800px]">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-12 border-b border-white/5 pb-6">{t.detail}</h3>
            {selectedLog ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <h4 className="text-4xl font-black text-white tracking-tighter uppercase">{selectedLog.name}</h4>
                <div className="grid grid-cols-2 gap-8">
                  <DetailItem label="Category" val={selectedLog.category} />
                  <DetailItem label="Date" val={selectedLog.impact_date} />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-tvk-gold uppercase tracking-widest">{t.command}</p>
                  <Select value={selectedLog.status} onValueChange={(val) => handleStatusUpdate(selectedLog.id, val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-none font-black text-xs uppercase tracking-widest focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-tvk-dark border-white/10 text-white">
                      <SelectItem value="Solving">In Progress</SelectItem>
                      <SelectItem value="Solved">Resolved</SelectItem>
                      <SelectItem value="Fake">Invalid/Fake</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-8 bg-black/40 border border-white/5 italic text-gray-400 text-lg leading-relaxed">"{selectedLog.description}"</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-48 opacity-10">
                <Shield className="h-32 w-32" />
                <p className="text-xs font-black uppercase tracking-[0.4em] mt-8">Secure Terminal</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, val, color }) {
  return (
    <div className="bg-black/40 p-8 hover:bg-white/[0.02] transition-colors">
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black ${color}`}>{val}</p>
    </div>
  );
}

function FilterField({ label, val, setVal, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</label>
      <Select value={val} onValueChange={setVal}>
        <SelectTrigger className="bg-white/5 border-white/10 text-xs h-10 px-3 rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-tvk-dark border-white/10 text-white font-bold text-xs uppercase">
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function DetailItem({ label, val }) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{val}</p>
    </div>
  );
}