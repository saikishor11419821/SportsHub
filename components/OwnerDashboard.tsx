
import React, { useState } from 'react';
import { Booking, Turf, SportType } from '../types';
import { ALL_SPORTS, SPORT_IMAGES } from '../constants';

interface OwnerDashboardProps {
  bookings: Booking[];
  turfs: Turf[];
  onAddTurf: (turf: Omit<Turf, 'id'>) => void;
  onEditTurf: (id: string, turf: Partial<Turf>) => void;
  onRemoveTurf: (id: string) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ bookings, turfs, onAddTurf, onEditTurf, onRemoveTurf }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSportOpen, setIsSportOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: 1000,
    sport: 'Football' as SportType,
    location: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800'
  });

  const activeBookings = bookings.filter(b => b.status === 'upcoming');
  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleEditClick = (turf: Turf) => {
    setForm({
      name: turf.name,
      price: turf.pricePerHour,
      sport: turf.sports[0],
      location: turf.location,
      description: turf.description,
      image: turf.image
    });
    setEditingId(turf.id);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const turfData = {
      name: form.name,
      pricePerHour: form.price,
      sports: [form.sport],
      location: form.location,
      description: form.description,
      image: form.image,
      rating: 5.0,
      amenities: ['Professional Lights', 'Locker Rooms', 'Refreshments'],
      ownerId: ''
    };

    if (editingId) {
      onEditTurf(editingId, turfData);
    } else {
      onAddTurf(turfData);
    }

    setShowAddForm(false);
    setForm({ name: '', price: 1000, sport: 'Football', location: '', description: '', image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800' });
    setEditingId(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Arena Management Hub</h2>
          <p className="text-slate-400 font-medium mt-1">Control your facilities and monitor real-time performance</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ name: '', price: 1000, sport: 'Football', location: '', description: '', image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800' });
            setShowAddForm(true);
          }}
          className="bg-emerald-500 text-slate-900 font-black px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3 w-full lg:w-auto justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          Register New Arena
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Estimated Revenue', val: `₹${totalRevenue.toLocaleString()}`, color: 'emerald', icon: '💰' },
          { label: 'Active Facilities', val: turfs.length, color: 'blue', icon: '🏟️' },
          { label: 'Pending Sessions', val: activeBookings.length, color: 'purple', icon: '📅' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-6 right-8 text-4xl opacity-20 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Management Table */}
        <div className="xl:col-span-2 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h3 className="font-black text-white uppercase tracking-widest text-xs">Recent Venue Bookings</h3>
            <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">LIVE DATA</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">Customer</th>
                  <th className="px-10 py-6">Arena Name</th>
                  <th className="px-10 py-6">Price</th>
                  <th className="px-10 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {bookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-500 font-bold italic">Waiting for your first booking...</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-emerald-500">
                          {b.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-white text-sm">{b.userName}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-slate-400 text-sm">{turfs.find(t => t.id === b.turfId)?.name || 'Venue Unavailable'}</td>
                    <td className="px-10 py-6 font-black text-emerald-400 text-sm">₹{b.totalPrice}</td>
                    <td className="px-10 py-6 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${b.status === 'upcoming' ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'bg-slate-700 text-slate-400'
                        }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assets & Settings */}
        <div className="space-y-8">
          <div className="bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 p-10 shadow-2xl">
            <h3 className="font-black text-white uppercase tracking-widest text-xs mb-8">Registered Facilities</h3>
            <div className="space-y-8">
              {turfs.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No facilities added yet.</p>
              ) : turfs.map(turf => (
                <div key={turf.id} className="flex gap-6 group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={turf.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">{turf.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">₹{turf.pricePerHour}/hr • {turf.sports[0]}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => handleEditClick(turf)} className="text-[9px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest">Edit</button>
                      <span className="text-slate-700">|</span>
                      <button onClick={() => onRemoveTurf(turf.id)} className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in zoom-in duration-300">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl relative">
            <button type="button" onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{editingId ? 'Edit Arena Details' : 'Deploy Arena'}</h3>
            <p className="text-slate-500 text-sm mb-10 font-medium">{editingId ? 'Update your facility information' : 'Add a new facility to the SportsHub network'}</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Arena Branding Name</label>
                <input
                  placeholder="e.g. Velocity Pitch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Primary Sport Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSportOpen(!isSportOpen)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-white flex items-center justify-between hover:border-emerald-500/50 transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <img src={SPORT_IMAGES[form.sport]} className="w-8 h-8 rounded-lg object-cover bg-slate-800" alt="" />
                        <span className="font-bold">{form.sport}</span>
                      </div>
                      <svg className={`w-5 h-5 transition-transform text-slate-500 ${isSportOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {isSportOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 z-50 max-h-60 overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {ALL_SPORTS.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, sport: s, image: SPORT_IMAGES[s] });
                              setIsSportOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors text-left group"
                          >
                            <img src={SPORT_IMAGES[s]} className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-800 group-hover:border-emerald-500/50 transition-colors" alt="" />
                            <span className="font-bold text-slate-300 group-hover:text-white">{s}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Base Hourly Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="Price per hour"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Full Location Address</label>
                <input
                  placeholder="Street, City, Zip"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Facility Description & Amenities</label>
                <textarea
                  placeholder="Tell players about your high-quality synthetic grass, floodlights, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black rounded-2xl hover:bg-slate-700 transition-colors uppercase text-xs tracking-widest">Discard</button>
              <button type="submit" className="flex-1 py-5 bg-emerald-500 text-slate-900 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-widest">{editingId ? 'Save Changes' : 'Publish Arena'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
