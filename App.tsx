
import React, { useState, useEffect } from 'react';
import { Turf, Booking, ViewMode, User, SportType } from './types';
import { ALL_SPORTS } from './constants';
import Navbar from './components/Navbar';
import TurfCard from './components/TurfCard';
import UserDashboard from './components/UserDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import BookingModal from './components/BookingModal';
import ProfilePage from './components/ProfilePage';
import SupportPage from './components/SupportPage';
import Login from './components/Login';
import { generateTurfRecommendation } from './services/geminiService';
import { dbService, auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('player');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [aiTip, setAiTip] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const scheduleRef = React.useRef<HTMLDivElement>(null);

  const scrollToSchedule = () => {
    if (scheduleRef.current) {
      scheduleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Auth Listener
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch full user profile from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser(userData);
            setViewMode(userData.role); // Auto-set view mode
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading once auth check is done
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
      if (user.role === 'player') {
        const fetchAiTip = async () => {
          const tip = await generateTurfRecommendation(`user interest in ${filterSport === 'All' ? 'various sports' : filterSport}`);
          setAiTip(tip || '');
        };
        fetchAiTip();
      }
    }
  }, [user, filterSport]);

  const handleEditTurf = async (id: string, updatedData: any) => {
    await dbService.updateTurf(id, updatedData);
    loadData();
  };

  const handleRemoveTurf = async (id: string) => {
    if (confirm('Are you sure you want to remove this facility? Future bookings will be unaffected but no new bookings can be made.')) {
      await dbService.deleteTurf(id);
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedTurfs = await dbService.getTurfs();
      // Players see their own bookings, Owners see bookings for their turfs
      const fetchedBookings = await dbService.getBookings(user?.role === 'player' ? user.id : undefined);
      setTurfs(fetchedTurfs);
      setBookings(fetchedBookings);
    } catch (e) {
      console.error("Data loading issue:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setViewMode(loggedInUser.role);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedTurf(null);
    setIsBookingModalOpen(false);
  };

  const handleBookSlot = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'userName' | 'userId' | 'paymentStatus'>) => {
    if (!user) return;
    const newBooking: Omit<Booking, 'id'> = {
      ...bookingData,
      userId: user.id,
      userName: user.name,
      status: 'upcoming',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    };
    await dbService.addBooking(newBooking);
    loadData();
  };

  const handleCancelBooking = async (bookingId: string) => {
    await dbService.updateBookingStatus(bookingId, 'cancelled');
    loadData();
  };

  const handleAddTurf = async (newTurf: Omit<Turf, 'id'>) => {
    if (!user) return;
    await dbService.addTurf({ ...newTurf, ownerId: user.id });
    loadData();
  };

  const filteredTurfs = turfs.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = filterSport === 'All' || t.sports.includes(filterSport as any);
    return matchesSearch && matchesSport;
  });

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
        onScrollToSchedule={scrollToSchedule}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing sports data...</p>
          </div>
        ) : isSupportOpen ? (
          <SupportPage onBack={() => setIsSupportOpen(false)} />
        ) : isProfileOpen ? (
          <ProfilePage
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={handleLogout}
            onBack={() => setIsProfileOpen(false)}
          />
        ) : viewMode === 'player' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Player Interface: Discovery & Personal Journey */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-indigo-800 p-8 md:p-16 shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-6">SportsHub Player Console</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-white">Your Next <span className="text-emerald-300 italic">Victory</span> Starts Here.</h1>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search venues or cities..."
                      className="w-full px-8 py-5 rounded-2xl bg-white text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-6 py-5 rounded-2xl bg-slate-900/50 backdrop-blur-md text-white font-bold border-2 border-white/10 focus:outline-none"
                    value={filterSport}
                    onChange={(e) => setFilterSport(e.target.value)}
                  >
                    <option value="All">All Sports</option>
                    {ALL_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {aiTip && (
                  <div className="mt-10 p-5 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 flex items-start gap-4">
                    <div className="bg-emerald-400 p-2 rounded-lg text-slate-900 font-bold text-xs shrink-0">AI</div>
                    <p className="text-sm font-medium leading-relaxed text-emerald-50">{aiTip}</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            <section>
              <div className="flex justify-between items-baseline mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Discover Arenas</h2>
                  <p className="text-slate-400 mt-1">Available facilities tailored for you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTurfs.map(turf => (
                  <TurfCard
                    key={turf.id}
                    turf={turf}
                    onBook={() => {
                      setSelectedTurf(turf);
                      setIsBookingModalOpen(true);
                    }}
                  />
                ))}
              </div>
              {filteredTurfs.length === 0 && (
                <div className="text-center py-20 bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-700">
                  <p className="text-slate-500 font-bold text-lg">No arenas found.</p>
                </div>
              )}
            </section>

            <div ref={scheduleRef}>
              <UserDashboard bookings={bookings} onCancel={handleCancelBooking} turfs={turfs} />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Owner Interface: Fleet Management & Analytics */}
            <OwnerDashboard
              bookings={bookings.filter(b => turfs.some(t => t.id === b.turfId && t.ownerId === user.id))}
              turfs={turfs.filter(t => t.ownerId === user.id)}
              onAddTurf={handleAddTurf}
              onEditTurf={handleEditTurf}
              onRemoveTurf={handleRemoveTurf}
            />
          </div>
        )}
      </main>

      {selectedTurf && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedTurf(null);
          }}
          turf={selectedTurf}
          existingBookings={bookings.filter(b => b.turfId === selectedTurf.id)}
          onConfirm={handleBookSlot}
        />
      )}
    </div>
  );
};

export default App;
