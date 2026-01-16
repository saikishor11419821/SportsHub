
import React from 'react';
import { Booking, Turf } from '../types';

interface UserDashboardProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
  turfs: Turf[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ bookings, onCancel, turfs }) => {
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase tracking-[0.05em]">Your Schedule</h2>
          <p className="text-slate-400 font-medium">Keep track of your match sessions and arena bookings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Sessions for Players */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Upcoming Games</h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20">{upcomingBookings.length} ACTIVE</span>
          </div>
          
          {upcomingBookings.length === 0 ? (
            <div className="bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-[2.5rem] p-16 text-center">
              <div className="text-4xl mb-4 opacity-20">🏟️</div>
              <p className="text-slate-500 font-bold text-lg">Field is empty!</p>
              <p className="text-slate-600 text-sm mt-1">Book your next game from the discovery section above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => {
                const turf = turfs.find(t => t.id === booking.turfId);
                return (
                  <div key={booking.id} className="bg-slate-800/40 rounded-[2rem] p-6 border border-slate-700/50 flex gap-6 items-center group hover:border-emerald-500/30 transition-all shadow-xl">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-slate-700 shadow-xl bg-slate-900">
                      <img src={turf?.image} alt={turf?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                        <h4 className="font-black text-white text-lg truncate tracking-tight">{turf?.name || 'Venue'}</h4>
                      </div>
                      <p className="text-emerald-400 font-black text-sm uppercase tracking-widest">{booking.date} • {booking.timeSlot}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Verified Payment • ₹{booking.totalPrice}</p>
                    </div>
                    <button 
                      onClick={() => onCancel(booking.id)}
                      className="p-4 bg-slate-900 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-2xl transition-all active:scale-90 shrink-0"
                      title="Cancel Booking"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Play History for Players */}
        <div className="space-y-6">
          <div className="px-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Game History</h3>
          </div>
          
          {pastBookings.length === 0 ? (
             <div className="bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-[2.5rem] p-16 text-center">
              <p className="text-slate-500 font-bold text-lg italic opacity-50">Log is clean.</p>
            </div>
          ) : (
            <div className="bg-slate-900/30 rounded-[2.5rem] border border-slate-800 p-8 space-y-4 shadow-inner">
              {pastBookings.map(booking => {
                const turf = turfs.find(t => t.id === booking.turfId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                        <img src={turf?.image} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-60 transition-opacity" alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-300">{turf?.name || 'Previous Venue'}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{booking.date}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
