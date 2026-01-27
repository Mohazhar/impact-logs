import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowLeft, Filter, Loader2, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../src/lib/api';

// Fix for default Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper Component to auto-center map when logs change
function MapRecenter({ logs }) {
  const map = useMap();
  useEffect(() => {
    if (logs.length > 0) {
      const bounds = L.latLngBounds(logs.map(log => [log.gps_latitude, log.gps_longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [logs, map]);
  return null;
}

export default function LiveMaps() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get('/public/impact-logs');
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    let filtered = [...logs];
    if (selectedCategory !== 'All') filtered = filtered.filter(log => log.category === selectedCategory);
    if (selectedStatus !== 'All') filtered = filtered.filter(log => log.status === selectedStatus);
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

  // Custom marker function
  const createCustomIcon = (status) => {
    let color = '#f59e0b'; // Default amber
    if (status === 'Solved') color = '#059669';
    if (status === 'Fake') color = '#ef4444';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 font-bold text-sm">
              <ArrowLeft className="h-4 w-4" /> Home
            </button>
            <div className="flex items-center gap-2 border-l pl-4">
              <Navigation className="h-5 w-5 text-emerald-700" />
              <span className="text-lg font-black text-slate-800 tracking-tight">Live Impact Map</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/login')} variant="ghost" className="font-bold">Login</Button>
            <Button onClick={() => navigate('/signup')} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold">Join</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Geospatial Intelligence</h1>
            <p className="text-slate-500 font-medium">Tracking real-world restorations across the region.</p>
          </div>
          
          <div className="bg-white p-2 rounded-2xl border shadow-sm flex items-center gap-4 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] border-none bg-stone-50 font-bold">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sectors</SelectItem>
                <SelectItem value="Road">Roads</SelectItem>
                <SelectItem value="Water">Water Supply</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px] border-none bg-stone-50 font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Solving">In Progress</SelectItem>
                <SelectItem value="Solved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Real Map Section */}
          <div className="lg:col-span-3 bg-white rounded-3xl border shadow-xl overflow-hidden h-[650px] relative z-0">
            {loading && (
              <div className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                <span className="mt-2 font-bold text-slate-600 uppercase text-xs">Loading Live Data...</span>
              </div>
            )}
            
            <MapContainer 
              center={[11.0168, 76.9558]} // Default Coimbatore center
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              {/* Professional Dark/Clean Map Theme */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MapRecenter logs={filteredLogs} />

              {filteredLogs.map((log) => (
                <Marker 
                  key={log.id} 
                  position={[log.gps_latitude, log.gps_longitude]}
                  icon={createCustomIcon(log.status)}
                  eventHandlers={{
                    click: () => setSelectedLog(log),
                  }}
                >
                  <Popup>
                    <div className="font-sans p-1">
                      <p className="font-bold text-slate-900">{log.name}</p>
                      <p className="text-[10px] uppercase font-black text-emerald-600">{log.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur p-3 rounded-xl border shadow-lg flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">In Progress</span>
               </div>
               <div className="flex items-center gap-2 border-l pl-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-600" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Resolved</span>
               </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border shadow-xl p-6 h-full min-h-[400px]">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                 <Info className="h-5 w-5 text-slate-400" />
                 <h2 className="font-bold text-slate-800">Node Intelligence</h2>
              </div>

              {selectedLog ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{selectedLog.name}</h3>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Detailed Narrative</p>
                      <p className="text-sm leading-relaxed text-slate-600 font-medium italic">"{selectedLog.description}"</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start gap-3">
                         <MapPin className="h-4 w-4 text-emerald-600 mt-1" />
                         <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">Site Coordinates</p>
                           <p className="text-xs font-mono font-bold text-slate-700">
                             {selectedLog.gps_latitude.toFixed(4)}, {selectedLog.gps_longitude.toFixed(4)}
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold mt-4">
                    Verify this Node
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-300">
                  <MapPin className="h-10 w-10 mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase max-w-[150px] leading-relaxed">
                    Click a map marker to view detailed field intelligence
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