import React, { useState } from 'react';
import { Search, Filter, Calendar, Users, MapPin, ArrowRight, Tag, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTamil, setIsTamil] = useState(false);

  // Bilingual Content Dictionary
  const t = {
    title: isTamil ? "சமூகத் திட்டங்கள்" : "Community Projects",
    subtitle: isTamil ? "உள்ளூர் முன்னேற்றத்திற்கான முன்முயற்சிகளைக் கண்டறிந்து அவற்றில் இணையுங்கள்." : "Discover and join local initiatives making a tangible difference.",
    searchPlaceholder: isTamil ? "திட்டங்களைத் தேடு..." : "Find projects...",
    filterBtn: isTamil ? "வடிகட்டி" : "Filter",
    volunteers: isTamil ? "தன்னார்வலர்கள்" : "Volunteers Joined",
    details: isTamil ? "விவரங்களைக் காண்க" : "View Details",
    urgent: isTamil ? "அவசரம்" : "Urgent",
    active: isTamil ? "செயல்பாட்டில்" : "Active",
    upcoming: isTamil ? "வரவிருப்பவை" : "Upcoming"
  };

  const projects = [
    {
      id: 1,
      title: isTamil ? "மெயின் ரோடு சீரமைப்பு ஒருங்கிணைப்பு" : "Main Street Pothole Coordination",
      category: isTamil ? "உள்கட்டமைப்பு" : "Infrastructure",
      location: isTamil ? "நகர மையம்" : "Downtown District",
      volunteersNeeded: 5,
      currentVolunteers: 2,
      date: isTamil ? "ஜன 25, 2026" : "Jan 25, 2026",
      status: 'Active',
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: isTamil ? "சமூகப் பூங்கா மறுசீரமைப்பு" : "Community Park Reforestation",
      category: isTamil ? "சுற்றுச்சூழல்" : "Environment",
      location: isTamil ? "கிழக்கு பூங்கா" : "East Side Park",
      volunteersNeeded: 20,
      currentVolunteers: 14,
      date: isTamil ? "பிப் 01, 2026" : "Feb 01, 2026",
      status: 'Upcoming',
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen text-white selection:bg-tvk-gold selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header & Language Toggle */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsTamil(!isTamil)}
            className="px-4 py-2 border border-tvk-gold/30 rounded-md text-[10px] font-bold text-tvk-gold hover:bg-tvk-gold/10 flex items-center gap-2 transition-all bg-black/20"
          >
            <Globe className="w-3 h-3" /> {isTamil ? "ENGLISH" : "தமிழ்"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-l-4 border-tvk-gold pl-8">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
              {t.title}
            </h1>
            <p className="mt-4 text-xl text-gray-400 font-medium max-w-2xl">
              {t.subtitle}
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-none focus:border-tvk-gold outline-none w-full md:w-72 text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-transparent border border-white/10 rounded-none px-6 hover:bg-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
              <Filter size={16} /> {t.filterBtn}
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {projects.map((project) => (
            <div key={project.id} className="bg-black/40 backdrop-blur-xl border border-white/5 overflow-hidden hover:border-tvk-gold/30 transition-all duration-500 group relative">
              
              {/* Image Header with TVK Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl ${
                    project.status === 'Urgent' ? 'bg-red-600 border-red-500 text-white' : 'bg-tvk-maroon border-tvk-gold/50 text-tvk-gold'
                  }`}>
                    {isTamil ? t[project.status.toLowerCase()] : project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-tvk-gold font-black text-[10px] uppercase mb-4 tracking-[0.2em]">
                  <Tag size={14} /> {project.category}
                </div>
                <h3 className="text-2xl font-black text-white mb-6 leading-tight tracking-tighter uppercase group-hover:text-tvk-gold transition-colors">
                  {project.title}
                </h3>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                    <MapPin size={18} className="text-tvk-gold" /> {project.location}
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                    <Calendar size={18} className="text-tvk-gold" /> {project.date}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>{project.currentVolunteers} / {project.volunteersNeeded} {t.volunteers}</span>
                      <span className="text-tvk-gold">{Math.round((project.currentVolunteers / project.volunteersNeeded) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-none">
                      <div 
                        className="bg-tvk-gold h-full transition-all duration-1000 shadow-[0_0_15px_rgba(234,179,8,0.4)]" 
                        style={{ width: `${(project.currentVolunteers / project.volunteersNeeded) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-tvk-gold hover:bg-yellow-400 text-tvk-dark rounded-none py-8 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 group/btn transition-all shadow-lg shadow-yellow-500/10">
                  {t.details} <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Slogan */}
        <p className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 italic">
          பிறப்பொக்கும் எல்லா உயிர்க்கும்
        </p>
      </div>
    </div>
  );
}