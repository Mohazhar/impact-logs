import React from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Flame } from 'lucide-react';

export default function LeaderboardPage() {
  // Mock data - In production, fetch this from your FastAPI backend 
  // e.g., GET /api/users/leaderboard
  const topPerformers = [
    { id: 1, name: "Alex Rivera", points: 2840, logs: 42, badge: "Community Hero", rank: 2 },
    { id: 2, name: "Sarah Chen", points: 3150, logs: 56, badge: "Impact Legend", rank: 1 },
    { id: 3, name: "Marcus Thorne", points: 2100, logs: 31, badge: "Steady Contributor", rank: 3 },
  ];

  const others = [
    { id: 4, name: "Elena Rodriguez", points: 1850, logs: 24 },
    { id: 5, name: "Jordan Smith", points: 1620, logs: 19 },
    { id: 6, name: "Sam Wilson", points: 1400, logs: 15 },
    { id: 7, name: "Priya Patel", points: 1250, logs: 12 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
            <Trophy className="h-8 w-8 text-emerald-700" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Impact Leaderboard
          </h1>
          <p className="text-slate-600 mt-2">Recognizing the citizens driving change in our community.</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12">
          {topPerformers.sort((a, b) => a.rank - b.rank).map((user) => (
            <div 
              key={user.id} 
              className={`relative bg-white rounded-2xl p-6 text-center border-2 transition-all hover:shadow-xl ${
                user.rank === 1 
                  ? 'h-80 border-emerald-500 shadow-emerald-100 z-10 md:-translate-y-4' 
                  : 'h-64 border-stone-100'
              }`}
            >
              {user.rank === 1 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                  <Star className="fill-current" size={24} />
                </div>
              )}
              <div className="w-20 h-20 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-400">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-bold text-slate-800 text-xl">{user.name}</h3>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">{user.badge}</p>
              <div className="text-3xl font-black text-slate-700">{user.points}</div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Impact Points</p>
            </div>
          ))}
        </div>

        {/* Rest of the List */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Rank & User</span>
            <div className="flex gap-12">
              <span>Logs</span>
              <span>Total Points</span>
            </div>
          </div>
          
          <div className="divide-y divide-stone-100">
            {others.map((user, index) => (
              <div key={user.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-300 w-6">#{index + 4}</span>
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center font-bold text-emerald-700">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-700">{user.name}</span>
                </div>
                
                <div className="flex gap-12 items-center">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Flame size={16} className="text-orange-500" /> {user.logs}
                  </span>
                  <span className="text-emerald-700 font-black text-lg w-16 text-right">
                    {user.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 bg-emerald-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="z-10 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Ready to climb the ranks?</h3>
            <p className="text-emerald-100">Report an issue today and start earning impact points.</p>
          </div>
          <button className="z-10 bg-white text-emerald-900 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg active:scale-95">
            Log New Impact
          </button>
          <TrendingUp className="absolute -right-10 -bottom-10 h-64 w-64 text-emerald-800 opacity-50" />
        </div>

      </div>
    </div>
  );
}