import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { impactLogsAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Shield, LogOut, Filter, MapPin, User } from 'lucide-react';

const CATEGORIES = ['All', 'Road', 'Water', 'Sanitation', 'Electricity', 'Other'];
const STATUSES = ['All', 'Solving', 'Solved', 'Fake'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Senior Developer Move: Memoize fetchLogs to prevent unnecessary effect triggers
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
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]); // Added fetchLogs as dependency

  // Clean Fix: Use useCallback to stabilize applyFilters reference
  const applyFilters = useCallback(() => {
    let filtered = [...logs];

    if (filterCategory !== 'All') {
      filtered = filtered.filter((log) => log.category === filterCategory);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((log) => log.status === filterStatus);
    }

    if (filterDate) {
      filtered = filtered.filter((log) => log.impact_date === filterDate);
    }

    setFilteredLogs(filtered);
  }, [logs, filterCategory, filterStatus, filterDate]); // List all used state variables

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Added applyFilters to dependency array to satisfy ESLint

  const handleStatusUpdate = async (logId, newStatus) => {
    try {
      await impactLogsAPI.updateStatus(logId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      
      // Update local state
      setLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === logId ? { ...log, status: newStatus } : log))
      );
      
      if (selectedLog?.id === logId) {
        setSelectedLog({ ...selectedLog, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Solving':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Fake':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-700" />
              <span className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="h-4 w-4" />
                <span className="font-medium text-sm">{profile?.name || 'Admin'}</span>
              </div>
              <Button
                data-testid="admin-logout-btn"
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-hover hover:shadow-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Reports</p>
            <p className="text-3xl font-black text-slate-900" style={{ fontFamily: 'Outfit' }}>{logs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-hover hover:shadow-md">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">In Progress</p>
            <p className="text-3xl font-black text-amber-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Solving').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-hover hover:shadow-md">
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">Resolved</p>
            <p className="text-3xl font-black text-emerald-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Solved').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-hover hover:shadow-md">
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-2">Flagged Fake</p>
            <p className="text-3xl font-black text-red-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Fake').length}
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Search Filters</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="filter-category-select" className="bg-white border-stone-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="filter-status-select" className="bg-white border-stone-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impact Date</label>
              <input
                data-testid="filter-date-input"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm h-10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Log Feed */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* List Section */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 h-fit max-h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
                Impact Feed <span className="text-slate-400 font-medium ml-2 text-sm uppercase tracking-widest">({filteredLogs.length})</span>
              </h3>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-700"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Syncing Data...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <MapPin className="h-12 w-12 text-stone-300 mx-auto mb-4 opacity-50" />
                <p className="text-stone-400 font-medium">No matching records found.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    data-testid="admin-log-card"
                    onClick={() => setSelectedLog(log)}
                    className={`group border border-stone-100 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                      selectedLog?.id === log.id 
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                      : 'hover:border-emerald-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit' }}>{log.name}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <MapPin className="h-3 w-3" />
                          {log.locality}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(log.status)}`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Detail View</h3>
                {selectedLog && (
                   <div className="flex gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase font-bold">ID: {selectedLog.id.slice(0, 8)}</span>
                   </div>
                )}
              </div>
              
              {selectedLog ? (
                <div data-testid="admin-log-details" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 leading-tight tracking-tight" style={{ fontFamily: 'Outfit' }}>
                      {selectedLog.name}
                    </h4>
                    <div className="flex gap-4">
                      <div className="bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                        <p className="text-sm font-bold text-slate-700">{selectedLog.category}</p>
                      </div>
                      <div className="bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Date</p>
                        <p className="text-sm font-bold text-slate-700">{selectedLog.impact_date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported By</p>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                          {selectedLog.profile?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{selectedLog.profile?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400">{selectedLog.profile?.email || 'No email verified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geolocation</p>
                      <p className="text-xs font-mono text-slate-500 bg-stone-50 p-2 rounded border border-stone-100 truncate">
                        {selectedLog.gps_latitude.toFixed(6)}, {selectedLog.gps_longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Context</p>
                    <div className="text-slate-600 bg-stone-50/50 p-6 rounded-2xl border border-stone-100 text-sm leading-relaxed italic italic-stone-500">
                      "{selectedLog.description}"
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100">
                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-4 block">Resolution Command</label>
                    <Select
                      value={selectedLog.status}
                      onValueChange={(value) => handleStatusUpdate(selectedLog.id, value)}
                    >
                      <SelectTrigger data-testid="update-status-select" className="bg-white border-2 border-stone-200 rounded-xl h-12 font-bold text-slate-700 focus:ring-emerald-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solving" className="font-bold text-amber-600">Mark as 'In Progress'</SelectItem>
                        <SelectItem value="Solved" className="font-bold text-emerald-600">Mark as 'Resolved'</SelectItem>
                        <SelectItem value="Fake" className="font-bold text-red-600">Mark as 'Invalid/Fake'</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="h-20 w-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                    <Shield className="h-10 w-10 text-stone-200" />
                  </div>
                  <p className="text-stone-400 font-medium max-w-[200px] leading-relaxed">
                    Please select a report from the feed to access administration controls.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}