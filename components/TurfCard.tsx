
import React from 'react';
import { Turf } from '../types';

interface TurfCardProps {
  turf: Turf;
  onBook: () => void;
}

import { SPORT_IMAGES } from '../constants';

const TurfCard: React.FC<TurfCardProps> = ({ turf, onBook }) => {
  const displayImage = SPORT_IMAGES[turf.sports[0]] || turf.image;

  return (
    <div className="group bg-slate-800/40 rounded-[2rem] overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={displayImage}
          alt={turf.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 right-4 bg-emerald-500 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xl">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {turf.rating}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          {turf.sports.slice(0, 2).map(sport => (
            <span key={sport} className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm">
              {sport}
            </span>
          ))}
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight">{turf.name}</h3>
        <p className="text-slate-500 text-sm mb-6 flex items-center gap-2 font-medium">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {turf.location}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {turf.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-[10px] text-slate-400 font-bold border border-slate-700 px-2 py-1 rounded-md">{a}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-bold uppercase tracking-widest mb-1">Starting from</span>
            <span className="text-2xl font-black text-white">₹{turf.pricePerHour}</span>
            <span className="text-slate-600 text-xs font-bold">/hr</span>
          </div>
          <button
            onClick={onBook}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black px-7 py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
          >
            Lock Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
