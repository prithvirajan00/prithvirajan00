
export type Role = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  duration: number; // in minutes
  language: string;
  releaseDate: string;
  rating: number;
  description: string;
  posterUrl: string;
  status: 'Now Showing' | 'Coming Soon';
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface ShowTime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  price: number;
  availableSeats: string[]; // List of seat IDs that are booked
}

export interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
}
