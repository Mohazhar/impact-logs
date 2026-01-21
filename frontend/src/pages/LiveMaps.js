import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowLeft, Layers, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function LiveMaps() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, selectedCategory, selectedStatus]);

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/public/impact-logs`);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }
    setFilteredLogs(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'bg-emerald-600';
      case 'Solving': return 'bg-amber-500';
      case 'Fake': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getCategoryIcon = (category) => {
    return '📍';
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
                <Navigation className="h-6 w-6 text-emerald-700" />
                <span className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Live Maps</span>
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
          <h1 className="text-4xl font-bold text-slate-700 mb-3" style={{ fontFamily: 'Outfit' }}>Live Impact Map</h1>
          <p className="text-lg text-slate-600">Real-time view of all reported community issues across locations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Filter Reports</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Road">Road</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                  <SelectItem value="Sanitation">Sanitation</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Solving">Solving</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-slate-600">
                Showing <span className="font-bold text-emerald-700">{filteredLogs.length}</span> reports
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-emerald-700" />
              <h3 className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Map View</h3>
            </div>
            <div className="relative bg-stone-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              {/* Simple coordinate grid visualization */}
              <div className="absolute inset-0 p-4 overflow-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`inline-flex items-center gap-2 m-2 px-3 py-2 rounded-full cursor-pointer transition-all ${
                      selectedLog?.id === log.id
                        ? 'bg-emerald-700 text-white scale-110'
                        : `${getStatusColor(log.status)} text-white hover:scale-105`
                    }`}
                    style={{
                      position: 'absolute',
                      left: `${((log.gps_longitude + 180) / 360) * 100}%`,
                      top: `${((90 - log.gps_latitude) / 180) * 100}%`,
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">{log.category}</span>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-400">No reports to display</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Solving</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span>Solved</span>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>Report Details</h3>
            {selectedLog ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-slate-700 mb-2" style={{ fontFamily: 'Outfit' }}>
                    {selectedLog.name}
                  </h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
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
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium text-slate-700">{selectedLog.locality}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">GPS Coordinates</p>
                  <p className="font-medium text-slate-700 font-mono text-sm">
                    {selectedLog.gps_latitude}, {selectedLog.gps_longitude}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-2">Description</p>
                  <p className="text-slate-700 bg-stone-50 p-4 rounded-md border border-stone-200">
                    {selectedLog.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Click on a marker to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h3 className="text-xl font-bold text-slate-700 mb-4" style={{ fontFamily: 'Outfit' }}>All Reports</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedLog?.id === log.id
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-stone-200 hover:border-emerald-500/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-700 text-sm">{log.name}</h4>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`}></span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{log.locality}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{log.category}</span>
                    <span>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}