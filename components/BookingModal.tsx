
import React, { useState, useEffect } from 'react';
import { Turf, Booking } from '../types';
import { TIME_SLOTS } from '../constants';
import { dbService } from '../firebase';
import { generateBookingNote } from '../services/geminiService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  turf: Turf;
  existingBookings: Booking[];
  onConfirm: (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'userName' | 'userId' | 'paymentStatus'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, turf, existingBookings, onConfirm }) => {
  const [step, setStep] = useState<'schedule' | 'payment' | 'processing' | 'success'>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [cardHolder, setCardHolder] = useState('Alex Player');
  const [cardNumber, setCardNumber] = useState('**** **** **** 4242');
  const [bookingNote, setBookingNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('schedule');
      setSelectedSlot(null);
      setBookingNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSlotBooked = (slot: string) => {
    return existingBookings.some(b => b.date === selectedDate && b.timeSlot === slot && b.status === 'upcoming');
  };

  const handleProceedToPayment = async () => {
    if (!selectedSlot) return;

    // Preliminary check
    if (isSlotBooked(selectedSlot)) {
      alert("Slot already booked! Please select another time.");
      return;
    }

    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    if (!selectedSlot) return;

    // Final Conflict Check before payment/confirmation
    const isAvailable = await dbService.checkSlotAvailability(turf.id, selectedDate, selectedSlot);

    if (!isAvailable) {
      alert("Slot already booked! Please try other timings.");
      setStep('schedule'); // Go back to schedule
      return;
    }

    setStep('processing');
    const note = await generateBookingNote(turf.name, turf.sports[0]);
    setBookingNote(note || '');

    setTimeout(async () => {
      await onConfirm({
        turfId: turf.id,
        date: selectedDate,
        timeSlot: selectedSlot!,
        totalPrice: turf.pricePerHour
      });
      setStep('success');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">

        {step === 'schedule' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter">Reserve Your Game</h2>
                <p className="text-sm text-slate-500 font-medium">Session at {turf.name}</p>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div>
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Step 1: Choose Date</label>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                    const date = new Date();
                    date.setDate(date.getDate() + offset);
                    const dateStr = date.toISOString().split('T')[0];
                    const isActive = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex-shrink-0 w-20 h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center transition-all ${isActive ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 hover:border-slate-700 text-slate-500'
                          }`}
                      >
                        <span className="text-[9px] font-black uppercase opacity-60 mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-2xl font-black">{date.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Step 2: Pick Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {TIME_SLOTS.map(slot => {
                    const booked = isSlotBooked(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${booked ? 'bg-slate-950 border-slate-950 text-slate-800 cursor-not-allowed opacity-30' :
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' :
                            'bg-slate-900 border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400'
                          }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Session Rate</p>
                  <p className="text-3xl font-black text-white tracking-tighter">₹{turf.pricePerHour}</p>
                </div>
                <button
                  disabled={!selectedSlot}
                  onClick={handleProceedToPayment}
                  className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${!selectedSlot ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-2xl'
                    }`}
                >
                  Pay & Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="animate-in slide-in-from-right-4 duration-300 p-10">
            <div className="mb-10 flex items-center gap-4">
              <button onClick={() => setStep('schedule')} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-2xl font-black text-white">Payment Portal</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-8 rounded-[2rem] border border-slate-600 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-10 bg-slate-600 rounded-lg"></div>
                  <svg className="w-12 h-8 text-white/20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z" /></svg>
                </div>
                <p className="text-xl font-mono text-white tracking-[0.2em] mb-8">{cardNumber}</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-black mb-1">Card Holder</p>
                    <p className="text-sm font-black text-white uppercase">{cardHolder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-black mb-1">Expires</p>
                    <p className="text-sm font-black text-white">12/28</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Holder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400 font-bold">You are paying</p>
                  <p className="text-xl font-black text-emerald-400">₹{turf.pricePerHour}.00</p>
                </div>
                <button
                  onClick={handleConfirmPayment}
                  className="bg-emerald-500 text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                >
                  Pay Securely
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 text-center animate-in zoom-in duration-500">
            <div className="relative mx-auto w-32 h-32 mb-10">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative z-10 w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <svg className="w-16 h-16 text-slate-900 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Syncing Arena Data...</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">Hang tight! We're processing your payment and notifying the ground manager.</p>

            {bookingNote && (
              <div className="bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 p-8 rounded-[2rem] max-w-md mx-auto">
                <p className="text-emerald-300 font-black text-lg italic leading-relaxed">"{bookingNote}"</p>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="p-20 text-center animate-in zoom-in duration-500">
            <div className="relative mx-auto w-32 h-32 mb-10">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"></div>
              <div className="relative z-10 w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <svg className="w-16 h-16 text-slate-900 animate-in spin-in-90 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Payment Successful!</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">Your slot has been confirmed. You're all set to play!</p>

            <button
              onClick={onClose}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
