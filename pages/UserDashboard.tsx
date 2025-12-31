
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Booking, Movie, ShowTime, Theater } from '../types';

const UserDashboard: React.FC = () => {
  const { bookings, currentUser, movies, showTimes, theaters, cancelBooking } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const userBookings = bookings.filter(b => b.userId === currentUser?.id);

  const getBookingDetails = (booking: Booking) => {
    const showTime = showTimes.find(st => st.id === booking.showTimeId);
    const movie = movies.find(m => m.id === showTime?.movieId);
    const theater = theaters.find(t => t.id === showTime?.theaterId);
    return { showTime, movie, theater };
  };

  const handleCancelClick = (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this booking? The seats will be released immediately.')) {
      cancelBooking(bookingId);
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status: 'Cancelled' } : null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Dashboard Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black text-white cinema-title mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Cinema Vault
          </h1>
          <p className="text-slate-400 font-medium text-lg">Your curated collection of digital movie stubs</p>
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-1 rounded-[2rem] backdrop-blur-md flex shadow-2xl">
           <div className="px-10 py-5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Passes</span>
              <span className="text-4xl font-black text-white">{userBookings.filter(b => b.status === 'Confirmed').length}</span>
           </div>
           <div className="w-px h-16 bg-white/10 self-center"></div>
           <div className="px-10 py-5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Investment</span>
              <span className="text-4xl font-black text-rose-500">₹{userBookings.reduce((a, b) => b.status === 'Confirmed' ? a + b.totalPrice : a, 0)}</span>
           </div>
        </div>
      </div>

      {/* Booking Grid */}
      {userBookings.length === 0 ? (
        <div className="bg-slate-900/20 border border-dashed border-slate-800 p-24 rounded-[3rem] text-center backdrop-blur-sm">
          <div className="bg-rose-600/5 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500/30 shadow-inner">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">No tickets in your vault</h2>
          <p className="text-slate-500 mb-12 max-w-sm mx-auto text-lg italic opacity-60">"The best stories are the ones we experience together. Start yours today."</p>
          <a href="/#" className="bg-rose-600 hover:bg-rose-700 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-rose-900/40 inline-block transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-xs">Browse Now Showing</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userBookings.map(booking => {
            const { showTime, movie, theater } = getBookingDetails(booking);
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div 
                key={booking.id} 
                className={`group relative bg-slate-900/60 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 cursor-pointer shadow-xl flex flex-col h-full active:scale-[0.98] ${isCancelled ? 'opacity-50 grayscale hover:grayscale-0' : 'hover:border-rose-500/30 hover:shadow-rose-900/20'}`}
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="aspect-[21/9] overflow-hidden relative">
                   <img src={movie?.posterUrl} className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt={movie?.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                   <div className="absolute top-5 left-5">
                      <div className="bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-slate-400 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest shadow-lg">
                        ID: {booking.id}
                      </div>
                   </div>
                   {isCancelled && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-4 border-rose-600 text-rose-600 font-black text-4xl px-8 py-2 rotate-[-15deg] uppercase tracking-[0.5em] opacity-80 cinema-title bg-slate-900/40 backdrop-blur-sm">
                          Void
                        </div>
                     </div>
                   )}
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-rose-400 transition-colors leading-tight line-clamp-1 cinema-title">{movie?.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                      <svg className="w-3.5 h-3.5 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      {theater?.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                     <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                        <span className="block text-slate-600 text-[8px] font-black uppercase tracking-widest mb-1">Time</span>
                        <span className="text-white font-black text-sm">{showTime?.time}</span>
                     </div>
                     <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                        <span className="block text-slate-600 text-[8px] font-black uppercase tracking-widest mb-1">Seats</span>
                        <span className="text-white font-black text-sm truncate">
                          {booking.seats.join(', ')}
                        </span>
                     </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</span>
                      <span className={`text-2xl font-black ${isCancelled ? 'text-slate-500 line-through' : 'text-rose-500'}`}>₹{booking.totalPrice}</span>
                    </div>
                    {!isCancelled && (
                      <button 
                        onClick={(e) => handleCancelClick(e, booking.id)}
                        className="bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        Cancel
                      </button>
                    )}
                    {isCancelled && (
                      <div className="bg-slate-800 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                        Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Ticket Modal */}
      {selectedBooking && (() => {
        const { showTime, movie, theater } = getBookingDetails(selectedBooking);
        const isCancelled = selectedBooking.status === 'Cancelled';
        const basePrice = (selectedBooking.seats.length * (showTime?.price || 0));
        const convenienceFee = selectedBooking.totalPrice - basePrice;

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3.5rem] shadow-[0_0_120px_rgba(225,29,72,0.15)] overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500">
              
              {/* Close Handle */}
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90 group"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Cinematic Header */}
              <div className="relative h-56">
                 <img src={movie?.posterUrl} className={`w-full h-full object-cover scale-105 transition-all duration-700 ${isCancelled ? 'grayscale opacity-40' : 'opacity-60'}`} alt={movie?.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                 
                 {isCancelled && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-[12px] border-rose-600/40 text-rose-600/40 font-black text-8xl px-12 py-4 rotate-[-15deg] uppercase tracking-[0.2em] cinema-title select-none">
                        Cancelled
                      </div>
                   </div>
                 )}

                 <div className="absolute bottom-8 left-12 right-12">
                    <div className="flex items-center gap-2 mb-3">
                       <span className={`${isCancelled ? 'bg-slate-700' : 'bg-rose-600'} text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg`}>
                         {isCancelled ? 'Void Ticket' : 'Electronic Entry'}
                       </span>
                       <span className="text-white/50 text-[10px] font-bold">Booking #{selectedBooking.id}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white cinema-title leading-tight drop-shadow-2xl">{movie?.title}</h2>
                 </div>
              </div>

              <div className="p-12">
                {/* Core Details Grid */}
                <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-12">
                  <div className="space-y-1">
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Cinema Location</span>
                    <p className="text-white font-black text-lg leading-tight">{theater?.name}</p>
                    <p className="text-slate-500 text-xs font-medium mt-1">{theater?.location}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Show Schedule</span>
                    <p className="text-white font-black text-lg">{showTime?.time}</p>
                    <p className="text-slate-500 text-xs font-medium mt-1">
                       {new Date(selectedBooking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Your Selection</span>
                    <div className="flex flex-wrap gap-2">
                       {selectedBooking.seats.map(s => (
                         <div key={s} className={`${isCancelled ? 'bg-slate-800 text-slate-600' : 'bg-white text-slate-950'} text-sm font-black w-11 h-11 rounded-2xl flex items-center justify-center border-b-4 ${isCancelled ? 'border-slate-900' : 'border-slate-300'} shadow-xl transform hover:scale-110 transition-transform`}>
                           {s}
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Pass Summary</span>
                    <p className="text-white font-black text-2xl">{selectedBooking.seats.length} Person(s)</p>
                    <p className={`${isCancelled ? 'text-slate-600' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mt-1`}>
                      {isCancelled ? 'Seats Released' : 'Premium Seating'}
                    </p>
                  </div>
                </div>

                {/* Perforated Receipt Stub */}
                <div className="relative bg-white/5 p-8 rounded-[2.5rem] border border-white/5 mb-12 overflow-hidden shadow-inner">
                   {/* Left Notch */}
                   <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-12 bg-slate-900 rounded-full border border-white/5"></div>
                   {/* Right Notch */}
                   <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-12 bg-slate-900 rounded-full border border-white/5"></div>
                   
                   <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-center">Transaction Details</h4>
                   
                   <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">Standard Ticket ({selectedBooking.seats.length}x)</span>
                        <span className={`font-black ${isCancelled ? 'text-slate-600 line-through' : 'text-white'}`}>₹{basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">Platform Convenience Fee</span>
                        <span className={`font-black ${isCancelled ? 'text-slate-600 line-through' : 'text-white'}`}>₹{convenienceFee}</span>
                      </div>
                   </div>
                   
                   <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {isCancelled ? 'Refund Processing' : 'Total Amount'}
                        </span>
                        <span className={`${isCancelled ? 'text-amber-500' : 'text-emerald-500'} text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mt-1`}>
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          {isCancelled ? 'Full Refund Initialized' : 'Paid via Digital Wallet'}
                        </span>
                      </div>
                      <span className={`text-4xl font-black cinema-title tracking-tighter ${isCancelled ? 'text-slate-600 line-through' : 'text-white'}`}>₹{selectedBooking.totalPrice}</span>
                   </div>
                </div>

                {/* Entry Validation QR */}
                <div className={`flex items-center gap-8 mb-12 px-6 ${isCancelled ? 'opacity-20 grayscale' : ''}`}>
                   <div className="flex-1">
                      <div className="h-14 bg-[repeating-linear-gradient(90deg,#94a3b8,#94a3b8_3px,transparent_3px,transparent_8px)] rounded-lg opacity-20"></div>
                   </div>
                   <div className="bg-white p-3 rounded-3xl shadow-2xl flex-shrink-0 transform rotate-1 hover:rotate-0 transition-transform duration-500 ring-8 ring-white/5">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CINE-VALIDATE-${selectedBooking.id}`} alt="Entry Code" className="w-20 h-20" />
                   </div>
                </div>

                {/* Dashboard Actions */}
                <div className="flex gap-4">
                   {!isCancelled ? (
                     <>
                      <button className="flex-1 bg-white text-slate-950 font-black py-5 rounded-[1.5rem] transition-all hover:bg-slate-200 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-95">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Get PDF Ticket
                      </button>
                      <button 
                        onClick={(e) => handleCancelClick(e, selectedBooking.id)}
                        className="flex-1 bg-slate-800 text-rose-500 border border-rose-500/20 font-black py-5 rounded-[1.5rem] transition-all hover:bg-rose-600 hover:text-white uppercase tracking-widest text-[10px] active:scale-95"
                      >
                          Cancel Booking
                      </button>
                     </>
                   ) : (
                     <button 
                      onClick={() => setSelectedBooking(null)}
                      className="w-full bg-slate-800 text-white font-black py-5 rounded-[1.5rem] transition-all hover:bg-slate-700 uppercase tracking-widest text-[10px] active:scale-95"
                     >
                        Return to Vault
                     </button>
                   )}
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
