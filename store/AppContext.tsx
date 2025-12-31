
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Movie, Theater, ShowTime, Booking } from '../types';
import { INITIAL_MOVIES, INITIAL_THEATERS, INITIAL_SHOWTIMES } from '../constants';

interface AppContextType {
  currentUser: User | null;
  movies: Movie[];
  theaters: Theater[];
  showTimes: ShowTime[];
  bookings: Booking[];
  login: (email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  addMovie: (movie: Movie) => void;
  deleteMovie: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateShowTimeSeats: (showTimeId: string, bookedSeats: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [theaters, setTheaters] = useState<Theater[]>(INITIAL_THEATERS);

  const [showTimes, setShowTimes] = useState<ShowTime[]>(() => {
    const saved = localStorage.getItem('showtimes');
    return saved ? JSON.parse(saved) : INITIAL_SHOWTIMES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
    localStorage.setItem('showtimes', JSON.stringify(showTimes));
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [movies, showTimes, bookings]);

  const login = (email: string, role: 'admin' | 'customer') => {
    const name = email.split('@')[0];
    const user: User = { id: Math.random().toString(36).substr(2, 9), name, email, role };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const addMovie = (movie: Movie) => setMovies([...movies, movie]);
  const deleteMovie = (id: string) => setMovies(movies.filter(m => m.id !== id));
  
  const addBooking = (booking: Booking) => setBookings([...bookings, booking]);

  const updateShowTimeSeats = (showTimeId: string, bookedSeats: string[]) => {
    setShowTimes(prev => prev.map(st => 
      st.id === showTimeId 
        ? { ...st, availableSeats: [...st.availableSeats, ...bookedSeats] }
        : st
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser, movies, theaters, showTimes, bookings,
      login, logout, addMovie, deleteMovie, addBooking, updateShowTimeSeats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
