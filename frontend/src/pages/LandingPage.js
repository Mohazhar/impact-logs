import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-emerald-700" />
              <span className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Outfit' }}>Local Impact Log</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Home</a>
              <button onClick={() => navigate('/live-maps')} className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Live Maps</button>
              <button onClick={() => navigate('/impact-stats')} className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Impact Stats</button>
              <button onClick={() => navigate('/community-activity')} className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Community</button>
              <a href="#about" className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Mission</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-emerald-700 transition-colors font-medium">Roadmap</a>
            </div>
            <div className="flex items-center gap-3">
              <Button
                data-testid="navbar-login-btn"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-slate-600 hover:text-emerald-700"
              >
                Login
              </Button>
              <Button
                data-testid="navbar-signup-btn"
                onClick={() => navigate('/signup')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
        <section id="home" className="relative pt-24 pb-16 lg:pt-40 lg:pb-28 overflow-hidden bg-white">
          {/* Refined Background Blobs: Reduced opacity for a cleaner look */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-50/60 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              
              {/* Refined Badge: Smaller font, tighter tracking */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 mb-8 shadow-xl shadow-slate-200 transform hover:scale-105 transition-all duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]" style={{ fontFamily: 'Public Sans' }}>
                  Your Neighborhood, Upgraded
                </span>
              </div>

              {/* Balanced Headline: Scaled down from 8xl to a professional 5xl/6xl */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Outfit' }}>
                Don’t Just Watch. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Drive Real Change.
                </span>
              </h1>

              {/* Refined Subtext: Smaller font size with better line-height */}
              <p className="text-base sm:text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto font-normal" style={{ fontFamily: 'Public Sans' }}>
                Tired of broken roads and ignored reports? Turn your smartphone into a <span className="text-slate-900 font-semibold underline decoration-emerald-300 decoration-2 underline-offset-4">civic powerhouse</span>. Spot it, pin it, and witness the fix happen.
              </p>

              {/* Action Stack: Balanced button sizes */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  data-testid="hero-get-started-btn"
                  onClick={() => navigate('/signup')}
                  className="group bg-emerald-700 hover:bg-slate-900 text-white px-8 py-6 text-base font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all duration-300 active:scale-95 flex items-center gap-2"
                >
                  Join the Movement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  data-testid="hero-login-btn"
                  onClick={() => navigate('/login')}
                  className="bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 px-8 py-6 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  Login
                </Button>
              </div>

              {/* Social Trust: Professional typography and spacing */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-10 lg:gap-20">
                {[
                  { label: 'Issues Solved', val: '2.4k' },
                  { label: 'Active Reporters', val: '15k' },
                  { label: 'Cities Managed', val: '12' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>{stat.val}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Be the Pulse of Your City
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: 'Public Sans' }}>
              Transforming your neighborhood isn't just a dream—it's a 3-step blueprint. Here is how we turn your local insights into real-world change.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="group relative p-8 rounded-3xl bg-stone-50 border border-transparent hover:bg-white hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500">
              <div className="absolute -top-4 -left-4 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>Capture the Moment</h3>
              <p className="text-slate-600 leading-relaxed" style={{ fontFamily: 'Public Sans' }}>
                See something that needs love? Snap a photo, pin the GPS, and let the data tell the story. Your perspective is the first spark of progress.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-8 rounded-3xl bg-stone-50 border border-transparent hover:bg-white hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500">
              <div className="absolute -top-4 -left-4 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Shield className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>Verified & Amplified</h3>
              <p className="text-slate-600 leading-relaxed" style={{ fontFamily: 'Public Sans' }}>
                Your report doesn't sit in an inbox. Our smart review system routes your voice directly to the hands that can help, ensuring every log is heard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-8 rounded-3xl bg-stone-50 border border-transparent hover:bg-white hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500">
              <div className="absolute -top-4 -left-4 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">3</div>
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight" style={{ fontFamily: 'Outfit' }}>Witness the Shift</h3>
              <p className="text-slate-600 leading-relaxed" style={{ fontFamily: 'Public Sans' }}>
                Watch the "Solving" status turn into "Solved." Track the momentum in real-time and celebrate the visible impact you've made on your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-stone-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      
      {/* Left Column: The Narrative */}
      <div className="relative">
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Stop Witnessing. <br />
          <span className="text-emerald-600">Start Impacting.</span>
        </h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium" style={{ fontFamily: 'Public Sans' }}>
          We’ve all seen it: the pothole that never gets filled, the streetlights that stay dark for weeks, and the water leaks that go ignored. Silence is what keeps communities stuck.
        </p>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed" style={{ fontFamily: 'Public Sans' }}>
          <strong className="text-slate-800">Local Impact Log</strong> isn't just a dashboard; it's your digital megaphone. We’ve built the bridge between your smartphone and the halls of local government to ensure your neighborhood's heartbeat never falters.
        </p>
        
        {/* The "Community" Card */}
        <div className="group flex items-center gap-6 p-8 bg-white border border-stone-200 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
            <Users className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-xl mb-1" style={{ fontFamily: 'Outfit' }}>The Coalition</h3>
            <p className="text-slate-500 font-medium" style={{ fontFamily: 'Public Sans' }}>Uniting everyday citizens, bold leaders, and civic changemakers under one mission.</p>
          </div>
        </div>
      </div>

      {/* Right Column: The Feature Set */}
      <div className="relative">
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="relative space-y-4">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <MapPin className="h-7 w-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>Laser-Point Precision</h4>
              <p className="text-slate-500 font-medium" style={{ fontFamily: 'Public Sans' }}>Zero guesswork. We use live GPS data to put issues exactly where they belong: on the map.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white hover:bg-white hover:shadow-lg transition-all duration-300 translate-x-4">
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <TrendingUp className="h-7 w-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>The Pulse Feed</h4>
              <p className="text-slate-500 font-medium" style={{ fontFamily: 'Public Sans' }}>No more "black hole" reports. Watch your impact move from 'Logged' to 'Solved' in real-time.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <Shield className="h-7 w-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight" style={{ fontFamily: 'Outfit' }}>Accountability First</h4>
              <p className="text-slate-500 font-medium" style={{ fontFamily: 'Public Sans' }}>We verify every log, creating a high-trust environment where data drives decision-making.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
      
      {/* Brand & Mission */}
      <div className="max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <MapPin className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase" style={{ fontFamily: 'Outfit' }}>
            Impact<span className="text-emerald-500">Log</span>
          </span>
        </div>
        <p className="text-lg leading-relaxed mb-6" style={{ fontFamily: 'Public Sans' }}>
          Building the digital infrastructure for modern civic action. One report, one fix, one community at a time.
        </p>
        <div className="flex gap-4">
          {/* Placeholder for Social Icons - Creator style needs social presence */}
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-900 transition-all cursor-pointer">
            <span className="sr-only">Twitter</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-900 transition-all cursor-pointer">
            <span className="sr-only">GitHub</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </div>
        </div>
      </div>

      {/* Quick Links Group */}
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigate</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#home" className="hover:text-emerald-400 transition-colors">Home Base</a></li>
            <li><a href="#about" className="hover:text-emerald-400 transition-colors">The Mission</a></li>
            <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">The Blueprint</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">Command</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button 
                onClick={() => navigate('/admin-login')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <Shield className="h-3 w-3" /> Admin Portal
              </button>
            </li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Data Privacy</a></li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm font-medium">
        © {new Date().getFullYear()} <span className="text-white">ImpactLog</span>. Engineered for the community.
      </p>
      <p className="text-xs tracking-tighter uppercase font-black text-slate-700">
        Live Data • Verified Impact • Public Trust
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}