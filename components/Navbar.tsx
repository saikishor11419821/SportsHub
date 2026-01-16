
import React from 'react';
import { ViewMode, User } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
  onScrollToSchedule: () => void;
  onOpenSupport: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode, user, onLogout, onOpenProfile, onScrollToSchedule, onOpenSupport }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-2xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-transparent rounded-xl flex items-center justify-center">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black text-white tracking-tighter block leading-none">SportsHub</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 block">Pro Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user.role === 'owner' ? (
              <div className="bg-slate-950 p-1.5 rounded-2xl flex border border-slate-800">
                <button
                  onClick={() => setViewMode('player')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'player' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Consumer View
                </button>
                <button
                  onClick={() => setViewMode('owner')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'owner' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Admin Console
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6 mr-4">
                <button className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">Find Arenas</button>
                <button onClick={onScrollToSchedule} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">My Schedule</button>
                <button onClick={onOpenSupport} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Support</button>
              </div>
            )}



            <button onClick={onOpenProfile} className="flex items-center gap-4 pl-6 border-l border-slate-800 group hover:bg-white/5 rounded-l-2xl transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-white truncate max-w-[120px] group-hover:text-emerald-400 transition-colors">{user.name}</p>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">View Profile</span>
              </div>
              <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl group-hover:border-emerald-500 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
