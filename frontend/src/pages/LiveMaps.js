import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowLeft, Layers, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function LiveMaps() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  // Senior Developer Move: Memoize the fetch function to stabilize dependencies
  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/public/impact-logs`);
      setLogs(data);
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
  }, [fetchLogs]); // Satisfies exhaustive-deps linting rule

  // Logic Optimization: Use useMemo for filtering to prevent heavy re-calculations
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }
    return filtered;
  }, [logs, selectedCategory, selectedStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'bg-emerald-600';
      case 'Solving': return 'bg-amber-500';
      case 'Fake': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
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
                className="group flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-all text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </button>
              <div className="h-4 w-px bg-stone-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-700" />
                <span className="text-lg font-black text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>Live Maps</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/login')} variant="ghost" className="text-sm font-bold">Login</Button>
              <Button onClick={() => navigate('/signup')} className="bg-emerald-700 hover:bg-slate-900 text-white rounded-full px-5 text-sm font-bold shadow-md transition-all">Join Movement</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Impact Visualizer
          </h1>
          <p className="text-base text-slate-500 max-w-2xl font-medium">
            Real-time geospatial intelligence tracking infrastructure restoration and community reports.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <div className="bg-emerald-50 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-emerald-700" />
               </div>
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-2xl">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-stone-50 border-none rounded-xl h-11 text-sm font-bold text-slate-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-100">
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Road">Road Restorations</SelectItem>
                  <SelectItem value="Water">Water Supply</SelectItem>
                  <SelectItem value="Sanitation">Sanitation</SelectItem>
                  <SelectItem value="Electricity">Electricity Grid</SelectItem>
                  <SelectItem value="Other">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-stone-50 border-none rounded-xl h-11 text-sm font-bold text-slate-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-100">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Solving">In Progress</SelectItem>
                  <SelectItem value="Solved">Completed Fixes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden lg:block text-right">
                <span className="text-2xl font-black text-emerald-700 block">{filteredLogs.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Active Nodes</span>
            </div>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Interaction Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-4 overflow-hidden h-[600px] relative">
              <div className="absolute top-8 left-8 z-10">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm flex items-center gap-2">
                   <Layers className="h-4 w-4 text-emerald-700" />
                   <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Satellite Layer Active</span>
                </div>
              </div>

              <div className="relative w-full h-full bg-slate-50 rounded-[1.5rem] overflow-hidden">
                {/* Background Grid for Tech look */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="absolute inset-0 p-10">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`absolute inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-500 shadow-lg ${
                        selectedLog?.id === log.id
                          ? 'bg-slate-900 text-white scale-110 z-20 ring-4 ring-emerald-400/30'
                          : `${getStatusColor(log.status)} text-white hover:scale-110 hover:z-10`
                      }`}
                      style={{
                        left: `${((log.gps_longitude + 180) / 360) * 100}%`,
                        top: `${((90 - log.gps_latitude) / 180) * 100}%`,
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{log.category}</span>
                    </div>
                  ))}
                  
                  {filteredLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MapPin className="h-12 w-12 text-stone-200 mb-2" />
                      <p className="text-stone-400 text-sm font-bold uppercase tracking-widest italic">No Data Nodes Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legend Component */}
            <div className="flex items-center gap-8 px-8 py-4 bg-white rounded-2xl border border-stone-100 shadow-sm w-fit">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-widest">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flagged</span>
              </div>
            </div>
          </div>

          {/* Context Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-8 h-full sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight" style={{ fontFamily: 'Outfit' }}>Node Context</h3>
              
              {selectedLog ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tighter" style={{ fontFamily: 'Outfit' }}>
                      {selectedLog.name}
                    </h4>
                    <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector</p>
                           <p className="text-sm font-bold text-slate-700">{selectedLog.category}</p>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                           <p className="text-sm font-bold text-slate-700">{selectedLog.impact_date}</p>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Observation Site</p>
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-emerald-600" />
                           {selectedLog.locality}
                        </p>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GPS Telemetry</p>
                        <p className="text-xs font-mono text-slate-500 bg-stone-50 p-3 rounded-xl border border-stone-100 border-dashed">
                          {selectedLog.gps_latitude.toFixed(6)}, {selectedLog.gps_longitude.toFixed(6)}
                        </p>
                     </div>

                     <div className="space-y-3 pt-4 border-t border-stone-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Field Narrative</p>
                        <div className="text-sm text-slate-500 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
                          "{selectedLog.description}"
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                     <MapPin className="h-8 w-8 text-stone-200" />
                  </div>
                  <p className="text-stone-400 font-medium text-sm max-w-[180px] leading-relaxed italic">
                    Select a data point on the map visualizer to load field details.
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