import React, { useState } from 'react';
import { Search, Filter, Calendar, Users, MapPin, ArrowRight, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - In a real-world app, this would come from your FastAPI /impact-logs endpoint
  const projects = [
    {
      id: 1,
      title: "Main Street Pothole Coordination",
      category: "Infrastructure",
      location: "Downtown District",
      volunteersNeeded: 5,
      currentVolunteers: 2,
      date: "Jan 25, 2026",
      status: "Active",
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: "Community Park Reforestation",
      category: "Environment",
      location: "East Side Park",
      volunteersNeeded: 20,
      currentVolunteers: 14,
      date: "Feb 01, 2026",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      title: "Flood Barrier Installation",
      category: "Safety",
      location: "Riverside Area",
      volunteersNeeded: 10,
      currentVolunteers: 8,
      date: "Jan 22, 2026",
      status: "Urgent",
      image: "https://images.unsplash.com/photo-1547683908-21aa538c716b?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Community Projects
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Discover and join local initiatives making a tangible difference.
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Find projects..." 
                className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${
                    project.status === 'Urgent' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-3 tracking-widest">
                  <Tag size={14} /> {project.category}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">
                  {project.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin size={16} className="text-slate-400" /> {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar size={16} className="text-slate-400" /> {project.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Users size={16} className="text-slate-400" /> {project.currentVolunteers} / {project.volunteersNeeded} Volunteers Joined
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 h-2 rounded-full mt-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(project.currentVolunteers / project.volunteersNeeded) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button className="w-full bg-slate-900 hover:bg-emerald-800 text-white rounded-xl py-6 flex items-center justify-center gap-2 group">
                  View Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}