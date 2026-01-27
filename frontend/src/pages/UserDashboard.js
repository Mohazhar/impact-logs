import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { impactLogsAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { MapPin, Plus, LogOut, User, FileText } from 'lucide-react';

const CATEGORIES = ['Road', 'Water', 'Sanitation', 'Electricity', 'Other'];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('my-logs');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchLogs();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await impactLogsAPI.getMyLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch logs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gps_latitude: position.coords.latitude.toFixed(6),
            gps_longitude: position.coords.longitude.toFixed(6)
          }));
          toast.success('Location detected!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await impactLogsAPI.create({
        name: formData.name,
        locality: formData.locality,
        gps_latitude: parseFloat(formData.gps_latitude),
        gps_longitude: parseFloat(formData.gps_longitude),
        impact_date: formData.impact_date,
        category: formData.category,
        description: formData.description
      });

      toast.success('Impact log submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        locality: '',
        gps_latitude: '',
        gps_longitude: '',
        impact_date: new Date().toISOString().split('T')[0],
        category: 'Road',
        description: ''
      });

      setActiveTab('my-logs');
      fetchLogs();
    } catch (error) {
      console.error('Error submitting log:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit log');
    } finally {
      setSubmitting(false);
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
              <MapPin className="h-6 w-6 text-emerald-700" />
              <span className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Local Impact Log</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                data-testid="nav-dashboard-btn"
                variant={activeTab === 'my-logs' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('my-logs')}
                className={activeTab === 'my-logs' ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : ''}
              >
                <FileText className="h-4 w-4 mr-2" />
                My Logs
              </Button>
              <Button
                data-testid="nav-add-impact-btn"
                variant={activeTab === 'add-impact' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('add-impact')}
                className={activeTab === 'add-impact' ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : ''}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Impact
              </Button>
              <Button
                data-testid="nav-logout-btn"
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
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <User className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Welcome, {profile?.name}!</h2>
              <p className="text-slate-600">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'my-logs' && (
          <div data-testid="my-logs-section">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
              <h3 className="text-2xl font-bold text-slate-700 mb-6" style={{ fontFamily: 'Outfit' }}>My Impact Logs</h3>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No impact logs yet</p>
                  <Button
                    data-testid="empty-add-impact-btn"
                    onClick={() => setActiveTab('add-impact')}
                    className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Impact
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      data-testid="impact-log-card"
                      className="border border-stone-200 rounded-lg p-6 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>{log.name}</h4>
                          <p className="text-slate-600">{log.locality}</p>
                        </div>
                        <span
                          data-testid="log-status-badge"
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(log.status)}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Category</p>
                          <p className="font-medium text-slate-700">{log.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Date</p>
                          <p className="font-medium text-slate-700">{log.impact_date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Location</p>
                          <p className="font-medium text-slate-700">{log.gps_latitude}, {log.gps_longitude}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Description</p>
                        <p className="text-slate-700">{log.description}</p>
                      </div>
                    </div>
                  ))}</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add-impact' && (
          <div data-testid="add-impact-section" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <h3 className="text-2xl font-bold text-slate-700 mb-6" style={{ fontFamily: 'Outfit' }}>Add Impact Log</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-slate-700">Issue Name *</Label>
                  <Input
                    id="name"
                    data-testid="impact-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g., Broken road near park"
                  />
                </div>

                <div>
                  <Label htmlFor="locality" className="text-slate-700">Locality *</Label>
                  <Input
                    id="locality"
                    data-testid="impact-locality-input"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    required
                    className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g., Downtown, Main Street"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700 mb-2 block">GPS Location *</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    data-testid="impact-latitude-input"
                    type="number"
                    step="any"
                    value={formData.gps_latitude}
                    onChange={(e) => setFormData({ ...formData, gps_latitude: e.target.value })}
                    required
                    className="bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Latitude"
                  />
                  <Input
                    data-testid="impact-longitude-input"
                    type="number"
                    step="any"
                    value={formData.gps_longitude}
                    onChange={(e) => setFormData({ ...formData, gps_longitude: e.target.value })}
                    required
                    className="bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Longitude"
                  />
                  <Button
                    data-testid="get-location-btn"
                    type="button"
                    onClick={handleGetLocation}
                    variant="outline"
                    className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Auto-Detect
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="impact-date" className="text-slate-700">Impact Date *</Label>
                  <Input
                    id="impact-date"
                    data-testid="impact-date-input"
                    type="date"
                    value={formData.impact_date}
                    onChange={(e) => setFormData({ ...formData, impact_date: e.target.value })}
                    required
                    className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-slate-700">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger
                      data-testid="impact-category-select"
                      className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700">Description *</Label>
                <Textarea
                  id="description"
                  data-testid="impact-description-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  className="mt-1 bg-white border-stone-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <Button
                data-testid="submit-impact-btn"
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 rounded-md shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                {submitting ? 'Submitting...' : 'Submit Impact Log'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
