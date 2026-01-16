
export type SportType = 
  | 'Football' 
  | 'Cricket' 
  | 'Tennis' 
  | 'Badminton' 
  | 'Basketball' 
  | 'Table Tennis' 
  | 'Hockey' 
  | 'Kabbadi' 
  | 'Boxing' 
  | 'Volleyball' 
  | 'Ko-ko' 
  | 'Throw Ball' 
  | 'E-sports' 
  | 'Athletics';

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  pricePerHour: number;
  image: string;
  sports: SportType[];
  amenities: string[];
  ownerId: string;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

export type ViewMode = 'player' | 'owner';

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: ViewMode;
  avatar?: string;
  licenseId?: string; // For owners
}
