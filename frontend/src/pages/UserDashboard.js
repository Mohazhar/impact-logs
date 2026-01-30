import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { impactLogsAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { MapPin, Plus, LogOut, User, FileText, Globe, Loader2 } from 'lucide-react';

const CATEGORIES = ['Road', 'Water', 'Sanitation', 'Electricity', 'Other'];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('my-logs');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isTamil, setIsTamil] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    locality: '',
    gps_latitude: '',
    gps_longitude: '',
    impact_date: new Date().toISOString().split('T')[0],
    category: 'Road',
    description: ''
  });

  const t = {
    title: isTamil ? "எனது தாக்க முனையங்கள்" : "My Impact Terminals",
    welcome: isTamil ? "வரவேற்கிறோம்" : "Welcome",
    myLogs: isTamil ? "எனது பதிவுகள்" : "My Logs",
    addImpact: isTamil ? "தாக்கத்தை சேர்" : "Add Impact",
    logout: isTamil ? "வெளியேறு" : "Logout",
    issueName: isTamil ? "பிரச்சினை பெயர்" : "Issue Name",
    locality: isTamil ? "வட்டாரம்" : "Locality",
    gps: isTamil ? "GPS அமைவிடம்" : "GPS Location",
    autoDetect: isTamil ? "தானாக கண்டறி" : "Auto-Detect",
    category: isTamil ? "வகை" : "Category",
    date: isTamil ? "தாக்க தேதி" : "Impact Date",
    desc: isTamil ? "விளக்கம்" : "Description",
    submit: isTamil ? "தாக்கப் பதிவை சமர்ப்பிக்கவும்" : "Submit Impact Log",
    noLogs: isTamil ? "இன்னும் பதிவுகள் இல்லை" : "No impact logs yet",
    loading: isTamil ? "ஒத்திசைக்கப்படுகிறது..." : "Synchronizing...",
    placeholderName: isTamil ? "எ.கா: பூங்காவிற்கு அருகில் உடைந்த சாலை" : "e.g., Broken road near park",
  };

  const fetchLogs = useCallback(async () => {
    try {
      const data = await impactLogsAPI.getMyLogs();
      setLogs(data);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(isTamil ? 'பதிவுகளைப் பெறுவதில் தோல்வி' : 'Failed to fetch logs');
      }
    } finally {
      setLoading(false);
    }
  }, [isTamil]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info(isTamil ? 'உங்கள் இருப்பிடத்தைப் பெறுகிறது...' : 'Getting location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gps_latitude: position.coords.latitude.toFixed(6),
            gps_longitude: position.coords.longitude.toFixed(6)
          }));
          toast.success(isTamil ? 'இருப்பிடம் கண்டறியப்பட்டது!' : 'Location detected!');
        },
        () => toast.error(isTamil ? 'இருப்பிடத்தைப் பெற முடியவில்லை' : 'Unable to get location')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await impactLogsAPI.create({
        ...formData,
        gps_latitude: parseFloat(formData.gps_latitude),
        gps_longitude: parseFloat(formData.gps_longitude),
      });
      toast.success(isTamil ? 'பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!' : 'Log submitted!');
      setFormData({
        name: '', locality: '', gps_latitude: '', gps_longitude: '',
        impact_date: new Date().toISOString().split('T')[0],
        category: 'Road', description: ''
      });
      setActiveTab('my-logs');
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Solved': return 'border-green-500 text-green-500 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      case 'Solving': return 'border-tvk-gold text-tvk-gold bg-tvk-gold/10 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
      case 'Fake': return 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      default: return 'border-gray-500 text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar: Command Bar Style */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-tvk-gold p-1.5 rounded-lg">
              <MapPin className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
              TVK <span className="text-tvk-gold">IMPACT</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTamil(!isTamil)}
              className="text-[10px] font-bold text-tvk-gold border border-tvk-gold/30 px-3 py-2 flex items-center gap-2 uppercase tracking-widest"
            >
              <Globe className="w-3 h-3" /> {isTamil ? "ENGLISH" : "தமிழ்"}
            </button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('my-logs')}
              className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'my-logs' ? 'text-tvk-gold bg-white/5' : 'text-gray-400'}`}
            >
              <FileText className="h-4 w-4 mr-2" /> {t.myLogs}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('add-impact')}
              className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'add-impact' ? 'text-tvk-gold bg-white/5' : 'text-gray-400'}`}
            >
              <Plus className="h-4 w-4 mr-2" /> {t.addImpact}
            </Button>
            <Button variant="ghost" onClick={signOut} className="text-gray-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest">
              <LogOut className="h-4 w-4 mr-2" /> {t.logout}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        {/* User Stats/Badge Section */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-tvk-gold p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <User className="h-8 w-8 text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black text-tvk-gold uppercase tracking-[0.3em] mb-1">{t.welcome}</p>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Outfit' }}>{profile?.name}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Citizen Authority</p>
            <p className="text-xl font-bold text-white">Level 0{logs.length > 5 ? '2' : '1'}</p>
          </div>
        </div>

        {/* Dynamic Content View */}
        {activeTab === 'my-logs' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-tvk-gold pl-6">{t.title}</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-30">
                <Loader2 className="h-12 w-12 animate-spin text-tvk-gold" />
                <p className="mt-4 font-black uppercase tracking-[0.4em] text-[10px]">{t.loading}</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-32 bg-black/20 border border-dashed border-white/10">
                <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-widest mb-8">{t.noLogs}</p>
                <Button onClick={() => setActiveTab('add-impact')} className="bg-tvk-gold text-black rounded-none font-black uppercase text-[10px] px-8 h-12">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Impact
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-1 bg-white/5 border border-white/5 p-1">
                {logs.map((log) => (
                  <div key={log.id} className="bg-black/40 p-8 border border-white/5 hover:border-tvk-gold/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-tvk-gold transition-colors">{log.name}</h4>
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-8 text-[10px] font-black uppercase tracking-widest">
                      <div>
                        <p className="text-gray-500 mb-1">{t.category}</p>
                        <p className="text-tvk-gold">{log.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">{t.date}</p>
                        <p className="text-white">{log.impact_date}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 italic text-sm text-gray-400">"{log.description}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-10 border-l-4 border-tvk-gold pl-6">{t.addImpact}</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.issueName}</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold" placeholder={t.placeholderName} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.locality}</Label>
                    <Input value={formData.locality} onChange={(e) => setFormData({ ...formData, locality: e.target.value })} required className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold" placeholder="e.g., Ward 12, Main St" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.gps}</Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input type="number" step="any" value={formData.gps_latitude} onChange={(e) => setFormData({ ...formData, gps_latitude: e.target.value })} required className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold font-mono" placeholder="Latitude" />
                    <Input type="number" step="any" value={formData.gps_longitude} onChange={(e) => setFormData({ ...formData, gps_longitude: e.target.value })} required className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold font-mono" placeholder="Longitude" />
                    <Button type="button" onClick={handleGetLocation} className="h-14 bg-white/10 hover:bg-white/20 border border-white/10 text-tvk-gold font-black uppercase text-[10px] tracking-widest rounded-none">
                      <MapPin className="h-4 w-4 mr-2" /> {t.autoDetect}
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.date}</Label>
                    <Input type="date" value={formData.impact_date} onChange={(e) => setFormData({ ...formData, impact_date: e.target.value })} required className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.category}</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-14 focus:border-tvk-gold uppercase font-bold text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-tvk-dark border-white/10 text-white uppercase font-bold text-xs">
                        {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.desc}</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={5} className="bg-white/5 border-white/10 rounded-none focus:border-tvk-gold italic" placeholder="Describe the status in detail..." />
                </div>

                <Button disabled={submitting} type="submit" className="w-full bg-tvk-gold hover:bg-yellow-400 text-black h-16 rounded-none font-black uppercase tracking-[0.3em] shadow-lg shadow-yellow-500/10">
                  {submitting ? t.loading : t.submit}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Slogan Footer */}
      <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
        பிறப்பொக்கும் எல்லா உயிர்க்கும்
      </p>
    </div>
  );
}