
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCVx9TLB_fYaNygBqfqYSWSGb_5N1KYoUw",
  authDomain: "sportshub-pro-daf6a.firebaseapp.com",
  projectId: "sportshub-pro-daf6a",
  storageBucket: "sportshub-pro-daf6a.firebasestorage.app",
  messagingSenderId: "156639387636",
  appId: "1:156639387636:web:db26608dcb51846aaaa3a1",
  measurementId: "G-7EHTCTTKJF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Helper for local storage fallback to ensure app is always "workable"
const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const dbService = {
  async getTurfs() {
    try {
      const q = query(collection(db, 'turfs'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal('fallback_turfs', data);
      return data;
    } catch (e) {
      console.warn("Firestore access denied. Falling back to local storage.", e);
      return getLocal('fallback_turfs');
    }
  },
  async addTurf(turf: any) {
    try {
      const docRef = await addDoc(collection(db, 'turfs'), turf);
      return docRef;
    } catch (e) {
      const local = getLocal('fallback_turfs');
      const newTurf = { ...turf, id: `local_${Date.now()}` };
      setLocal('fallback_turfs', [...local, newTurf]);
      return { id: newTurf.id };
    }
  },
  async getBookings(userId?: string) {
    try {
      const q = userId
        ? query(collection(db, 'bookings'), where('userId', '==', userId))
        : query(collection(db, 'bookings'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!userId) setLocal('fallback_bookings', data);
      return data;
    } catch (e) {
      const allBookings = getLocal('fallback_bookings');
      return userId ? allBookings.filter((b: any) => b.userId === userId) : allBookings;
    }
  },
  async addBooking(booking: any) {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), booking);
      return docRef;
    } catch (e) {
      const local = getLocal('fallback_bookings');
      const newBooking = { ...booking, id: `local_b_${Date.now()}` };
      setLocal('fallback_bookings', [newBooking, ...local]);
      return { id: newBooking.id };
    }
  },
  async updateBookingStatus(id: string, status: string) {
    try {
      const ref = doc(db, 'bookings', id);
      await updateDoc(ref, { status });
    } catch (e) {
      const local = getLocal('fallback_bookings');
      const updated = local.map((b: any) => b.id === id ? { ...b, status } : b);
      setLocal('fallback_bookings', updated);
    }
  },
  async deleteTurf(id: string) {
    try {
      await deleteDoc(doc(db, 'turfs', id));
    } catch (e) {
      const local = getLocal('fallback_turfs');
      setLocal('fallback_turfs', local.filter((t: any) => t.id !== id));
    }
  },
  async updateTurf(id: string, data: any) {
    try {
      const ref = doc(db, 'turfs', id);
      await updateDoc(ref, data);
    } catch (e) {
      // Local fallback not strictly necessary for update but good for consistency
      console.warn("Update turf failed", e);
    }
  },
  async deleteTurfsByOwner(ownerId: string) {
    try {
      const q = query(collection(db, 'turfs'), where('ownerId', '==', ownerId));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (e) {
      console.error("Error deleting owner turfs", e);
    }
  },
  async checkSlotAvailability(turfId: string, date: string, timeSlot: string) {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('turfId', '==', turfId),
        where('date', '==', date),
        where('timeSlot', '==', timeSlot),
        where('status', '==', 'upcoming')
      );
      const snapshot = await getDocs(q);
      return snapshot.empty; // Returns true if no matching bookings found (slot is available)
    } catch (e) {
      console.error("Error checking availability", e);
      // Fallback: Check local bookings if firestore fails
      const local = getLocal('fallback_bookings');
      const conflict = local.some((b: any) =>
        b.turfId === turfId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status === 'upcoming'
      );
      return !conflict;
    }
  }
};
