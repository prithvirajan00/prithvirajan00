
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Booking, Movie, ShowTime, Theater } from '../types';

const UserDashboard: React.FC = () => {
  const { bookings, currentUser, movies, showTimes, theaters } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const userBookings = bookings.filter(b => b.userId === currentUser?.id);

  const getBookingDetails = (booking: Booking) => {
    const showTime = showTimes.find(st => st.id === booking.showTimeId);
    const movie = movies.find(m => m.id === showTime?.movieId);
    const theater = theaters.find(t => t.id === showTime?.theaterId);
    return { showTime, movie, theater };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white cinema-title mb-2">Cinema Vault</h1>
          <p className="text-slate-400 font-medium">Your collection of cinematic memories and upcoming shows</p>
        </div>
        <div className="hidden md:block">
           <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block">Total Spent</span>
              <span className="text-2xl font-black text-rose-500">₹{userBookings.reduce((a, b) => a + b.totalPrice, 0)}</span>
           </div>
        </div>
      </div>

      {userBookings.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 p-20 rounded-3xl text-center backdrop-blur-sm">
          <div className="bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">The curtain hasn't risen yet</h2>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg">Your ticket collection is empty. Explore our latest blockbusters and start your journey!</p>
          <a href="/#" className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-rose-900/40 inline-block transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm">Find Movies</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userBookings.map(booking => {
            const { showTime, movie, theater } = getBookingDetails(booking);

            return (
              <div 
                key={booking.id} 
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-rose-500/50 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 blur-[60px] pointer-events-none group-hover:bg-rose-600/20 transition-colors"></div>
                
                <div className="flex">
                  <div className="w-32 sm:w-40 h-full overflow-hidden">
                     <img src={movie?.posterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={movie?.title} />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">Confirmed Ticket</span>
                         <span className="bg-slate-800 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold">#{booking.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-rose-400 transition-colors">{movie?.title}</h3>
                      <p className="text-slate-400 text-xs font-medium mb-4">{theater?.name}</p>
                      
                      <div className="flex gap-4 items-center">
                        <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
                           <span className="block text-slate-500 text-[8px] font-bold uppercase mb-0.5">Time</span>
                           <span className="text-white font-bold text-sm">{showTime?.time}</span>
                        </div>
                        <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
                           <span className="block text-slate-500 text-[8px] font-bold uppercase mb-0.5">Seats</span>
                           <span className="text-white font-bold text-sm">{booking.seats.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/50">
                       <span className="text-white font-black">₹{booking.totalPrice}</span>
                       <button className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1 uppercase tracking-widest">
                         View Details
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (() => {
        const { showTime, movie, theater } = getBookingDetails(selectedBooking);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/90 backdrop-blur-md transition-opacity">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-10">
                <div className="flex gap-6 mb-10">
                  <div className="w-24 h-36 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex-shrink-0">
                    <img src={movie?.posterUrl} alt={movie?.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-rose-500 text-xs font-black uppercase tracking-widest mb-1">Electronic Ticket</span>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2">{movie?.title}</h2>
                    <p className="text-slate-400 font-medium">{movie?.genre.join(' • ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800">
                    <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Theater</span>
                    <p className="text-white font-bold">{theater?.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{theater?.location}</p>
                  </div>
                  <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800">
                    <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Showtime</span>
                    <p className="text-white font-bold">{showTime?.time}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800 mb-10">
                   <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Seats</span>
                        <div className="flex flex-wrap gap-2">
                           {selectedBooking.seats.map(s => (
                             <span key={s} className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">{s}</span>
                           ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Paid</span>
                        <span className="text-2xl font-black text-white">₹{selectedBooking.totalPrice}</span>
                      </div>
                   </div>
                   
                   <div className="pt-6 border-t border-slate-700/50 flex items-center justify-between gap-6">
                      <div className="flex-1 h-12 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#334155_4px,#334155_6px)] opacity-30"></div>
                      <div className="bg-white p-2 rounded-lg">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedBooking.id}`} alt="QR" className="w-16 h-16" />
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 bg-white text-slate-900 font-black py-4 rounded-2xl transition-all hover:bg-slate-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download PDF
                   </button>
                   <button className="flex-1 bg-slate-800 text-white font-black py-4 rounded-2xl transition-all hover:bg-slate-700 uppercase tracking-widest text-xs">
                      Cancel Booking
                   </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default UserDashboard;
