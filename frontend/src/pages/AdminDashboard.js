import React, { useState, useEffect } from 'react';
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
  const { user, profile, signOut } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchLogs();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filterCategory, filterStatus, filterDate]);

  const fetchLogs = async () => {
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
  };

  const applyFilters = () => {
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
  };

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
      <nav className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-700" />
              <span className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="h-4 w-4" />
                <span>{profile?.name}</span>
              </div>
              <Button
                data-testid="admin-logout-btn"
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600"
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
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <p className="text-slate-600 text-sm mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>{logs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <p className="text-slate-600 text-sm mb-1">Solving</p>
            <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Solving').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <p className="text-slate-600 text-sm mb-1">Solved</p>
            <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Solved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <p className="text-slate-600 text-sm mb-1">Fake</p>
            <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Outfit' }}>
              {logs.filter((l) => l.status === 'Fake').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Filters</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="filter-category-select" className="bg-white border-stone-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="filter-status-select" className="bg-white border-stone-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Date</label>
              <input
                data-testid="filter-date-input"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* List View */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>
              All Impact Logs ({filteredLogs.length})
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No logs found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    data-testid="admin-log-card"
                    onClick={() => setSelectedLog(log)}
                    className={`border border-stone-200 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 ${
                      selectedLog?.id === log.id ? 'border-emerald-500 bg-emerald-50/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>{log.name}</h4>
                        <p className="text-sm text-slate-600">{log.locality}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(log.status)}`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{log.category}</span>
                      <span className="text-slate-500">{log.impact_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>Log Details</h3>
            
            {selectedLog ? (
              <div data-testid="admin-log-details" className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                    {selectedLog.name}
                  </h4>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedLog.status)}`}
                  >
                    {selectedLog.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Submitted By</p>
                    <p className="font-medium text-slate-700">{selectedLog.profile?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-600">{selectedLog.profile?.email || 'N/A'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Category</p>
                      <p className="font-medium text-slate-700">{selectedLog.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium text-slate-700">{selectedLog.impact_date}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Locality</p>
                    <p className="font-medium text-slate-700">{selectedLog.locality}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">GPS Coordinates</p>
                    <p className="font-medium text-slate-700">
                      {selectedLog.gps_latitude}, {selectedLog.gps_longitude}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">Description</p>
                    <p className="text-slate-700 bg-stone-50 p-4 rounded-md border border-stone-200">
                      {selectedLog.description}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-700 font-medium mb-2 block">Update Status</label>
                  <Select
                    value={selectedLog.status}
                    onValueChange={(value) => handleStatusUpdate(selectedLog.id, value)}
                  >
                    <SelectTrigger data-testid="update-status-select" className="bg-white border-stone-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solving">Solving</SelectItem>
                      <SelectItem value="Solved">Solved</SelectItem>
                      <SelectItem value="Fake">Fake</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a log to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
