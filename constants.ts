
import { Turf, Booking, User, SportType } from './types';

export const SPORT_IMAGES: Record<SportType, string> = {
  'Football': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg',
  'Cricket': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Eden_Gardens_under_floodlights_during_a_match.jpg',
  'Tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80',
  'Badminton': '/images/badminton.png',
  'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80',
  'Table Tennis': '/images/table_tennis.png',
  'Hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&q=80',
  'Kabbadi': '/images/kabaddi.png',
  'Boxing': 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80',
  'Volleyball': 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80',
  'Ko-ko': '/images/kho_kho.png',
  'Throw Ball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80',
  'E-sports': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
  'Athletics': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80'
};

export const ALL_SPORTS: SportType[] = [
  'Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball',
  'Table Tennis', 'Hockey', 'Kabbadi', 'Boxing', 'Volleyball',
  'Ko-ko', 'Throw Ball', 'E-sports', 'Athletics'
];

export const MOCK_USERS: User[] = [];
export const MOCK_TURFS: Turf[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];

export const TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];
