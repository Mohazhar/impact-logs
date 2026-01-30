import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowLeft, Loader2, Info, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../src/lib/api';

// Helper Component to auto-center map
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
  const [isTamil, setIsTamil] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  const t = {
    back: isTamil ? "முகப்பு" : "Home",
    title: isTamil ? "நேரலை வரைபடம்" : "Live Impact Map",
    geoTitle: isTamil ? "புவிசார் நுண்ணறிவு" : "Geospatial Intelligence",
    geoSub: isTamil ? "மண்டலம் முழுவதும் நடைபெறும் சீரமைப்புகளைக் கண்காணித்தல்." : "Tracking real-world restorations across the region.",
    category: isTamil ? "துறை" : "Category",
    status: isTamil ? "நிலை" : "Status",
    nodeIntel: isTamil ? "முனைய நுண்ணறிவு" : "Node Intelligence",
    narrative: isTamil ? "விரிவான விளக்கம்" : "Detailed Narrative",
    coords: isTamil ? "இடத்தின் ஒருங்கிணைப்புகள்" : "Site Coordinates",
    verify: isTamil ? "இந்த முனையத்தை சரிபார்க்கவும்" : "Verify this Node",
    loading: isTamil ? "நேரலை தரவுகள் ஏற்றப்படுகின்றன..." : "Loading Live Data...",
    inProgress: isTamil ? "செயல்பாட்டில்" : "In Progress",
    resolved: isTamil ? "தீர்க்கப்பட்டது" : "Resolved"
  };

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

  const createCustomIcon = (status) => {
    let color = '#EAB308'; // TVK Gold for Progress
    if (status === 'Solved') color = '#22c55e'; // Green for Solved
    if (status === 'Fake') color = '#ef4444';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 0 15px ${color}66;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  return (
    <div className="min-h-screen text-white selection:bg-tvk-gold selection:text-black">
      {/* Navbar: Glassmorphism */}
      <nav className="sticky top-0 z-[1000] bg-black/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-gray-400 hover:text-tvk-gold font-black text-[10px] uppercase tracking-widest transition-all">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> {t.back}
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <Navigation className="h-5 w-5 text-tvk-gold" />
              <span className="text-xl font-black text-white tracking-tighter uppercase">{t.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTamil(!isTamil)}
              className="px-3 py-1.5 border border-tvk-gold/30 rounded text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2"
            >
              <Globe className="w-3 h-3" /> {isTamil ? "ENG" : "தமிழ்"}
            </button>
            <Button onClick={() => navigate('/signup')} className="bg-tvk-gold hover:bg-yellow-400 text-black rounded-none font-black text-[10px] tracking-widest px-8 uppercase h-11">
              {isTamil ? "பதிவு செய்க" : "Join"}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-l-4 border-tvk-gold pl-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">{t.geoTitle}</h1>
            <p className="text-gray-400 font-medium text-lg">{t.geoSub}</p>
          </div>
          
          <div className="bg-white/5 p-2 border border-white/10 backdrop-blur-md flex items-center gap-2 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] border-none bg-transparent text-white font-black uppercase text-[10px] tracking-widest focus:ring-0">
                <SelectValue placeholder={t.category} />
              </SelectTrigger>
              <SelectContent className="bg-tvk-dark border-white/10 text-white">
                <SelectItem value="All">{isTamil ? "அனைத்து துறைகள்" : "All Sectors"}</SelectItem>
                <SelectItem value="Road">{isTamil ? "சாலைகள்" : "Roads"}</SelectItem>
                <SelectItem value="Water">{isTamil ? "குடிநீர்" : "Water Supply"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px] border-none bg-transparent text-white font-black uppercase text-[10px] tracking-widest focus:ring-0 border-l border-white/10">
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent className="bg-tvk-dark border-white/10 text-white">
                <SelectItem value="All">{isTamil ? "அனைத்து நிலைகள்" : "All Status"}</SelectItem>
                <SelectItem value="Solving">{t.inProgress}</SelectItem>
                <SelectItem value="Solved">{t.resolved}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-1">
          {/* Real Map Section: Dark Theme */}
          <div className="lg:col-span-3 bg-black/40 border border-white/5 h-[650px] relative z-0">
            {loading && (
              <div className="absolute inset-0 z-[1001] bg-tvk-dark/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-tvk-gold animate-spin" />
                <span className="mt-4 font-black text-tvk-gold uppercase text-[10px] tracking-[0.3em]">{t.loading}</span>
              </div>
            )}
            
            <MapContainer 
              center={[11.0168, 76.9558]} 
              zoom={13} 
              style={{ height: '100%', width: '100%', background: '#120000' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
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
                  <Popup className="tvk-map-popup">
                    <div className="p-2 bg-tvk-dark text-white border-none">
                      <p className="font-black uppercase text-xs text-tvk-gold tracking-tight">{log.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{log.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-8 left-8 z-[1000] bg-black/60 backdrop-blur-xl p-4 border border-white/10 flex gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-tvk-gold shadow-[0_0_10px_#EAB308]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">{t.inProgress}</span>
                </div>
                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">{t.resolved}</span>
                </div>
            </div>
          </div>

          {/* Details Sidebar: Prestige Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 h-full min-h-[400px]">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                  <Info className="h-5 w-5 text-tvk-gold" />
                  <h2 className="font-black text-white uppercase tracking-widest text-sm">{t.nodeIntel}</h2>
              </div>

              {selectedLog ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h3 className="text-3xl font-black text-white leading-tight mb-4 tracking-tighter uppercase">{selectedLog.name}</h3>
                    <div className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${selectedLog.status === 'Solved' ? 'border-green-500 text-green-500' : 'border-tvk-gold text-tvk-gold'}`}>
                      {isTamil ? (selectedLog.status === 'Solved' ? "தீர்க்கப்பட்டது" : "செயல்பாட்டில்") : selectedLog.status}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/[0.02] p-6 border border-white/5">
                      <p className="text-[9px] font-black text-tvk-gold uppercase tracking-[0.3em] mb-4">{t.narrative}</p>
                      <p className="text-sm leading-relaxed text-gray-400 font-medium italic">"{selectedLog.description}"</p>
                    </div>

                    <div className="flex items-start gap-4">
                       <MapPin className="h-5 w-5 text-tvk-gold mt-1" />
                       <div>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.coords}</p>
                         <p className="text-xs font-mono font-bold text-gray-300 mt-1">
                           {selectedLog.gps_latitude.toFixed(4)}° N, {selectedLog.gps_longitude.toFixed(4)}° E
                         </p>
                       </div>
                    </div>
                  </div>

                  <Button className="w-full bg-tvk-gold hover:bg-yellow-400 text-black rounded-none h-14 font-black uppercase tracking-[0.2em] mt-6 shadow-lg shadow-yellow-500/10">
                    {t.verify}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <MapPin className="h-12 w-12 mb-6 text-white/5" />
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] leading-relaxed max-w-[180px]">
                    Click a map marker to view field intelligence
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