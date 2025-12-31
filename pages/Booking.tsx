
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Booking as BookingType } from '../types';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 10;

const BookingPage: React.FC = () => {
  const { showTimeId } = useParams();
  const navigate = useNavigate();
  const { showTimes, movies, theaters, currentUser, addBooking, updateShowTimeSeats } = useApp();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<'seats' | 'payment' | 'success'>('seats');
  const [isProcessing, setIsProcessing] = useState(false);

  const showTime = showTimes.find(st => st.id === showTimeId);
  if (!showTime) return <div className="text-center py-20">Showtime not found</div>;

  const movie = movies.find(m => m.id === showTime.movieId);
  const theater = theaters.find(t => t.id === showTime.theaterId);

  const toggleSeat = (seatId: string) => {
    if (showTime.availableSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = (selectedSeats.length * showTime.price) + (selectedSeats.length > 0 ? 25 : 0);

  const handleConfirmBooking = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      const booking: BookingType = {
        id: 'B' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        userId: currentUser.id,
        showTimeId: showTime.id,
        seats: selectedSeats,
        totalPrice: totalPrice,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed'
      };

      addBooking(booking);
      updateShowTimeSeats(showTime.id, selectedSeats);
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-900/40">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-3 cinema-title">Jai Ho! Booked.</h2>
        <p className="text-slate-400 mb-10 text-lg">Your cinematic journey for <span className="text-rose-500 font-bold">{movie?.title}</span> is confirmed at {theater?.name}.</p>
        
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
           <div className="bg-white p-4 rounded-3xl inline-block mb-6 shadow-xl transition-transform group-hover:scale-110 duration-500">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CINEBOOKING-TKT-${Math.random().toString(36).substr(2, 8)}`} alt="QR Code" className="w-40 h-40" />
           </div>
           <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Scan at the counter</p>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-rose-900/40 active:scale-95"
        >
          Go to My Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {step === 'seats' ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black text-white cinema-title mb-2">Pick Your Spot</h2>
                  <p className="text-slate-500">Select the best seats for the ultimate experience</p>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-800 rounded-md border border-white/10"></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Free</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-600 rounded-md shadow-[0_0_10px_rgba(225,29,72,0.4)]"></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yours</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-600 rounded-md opacity-40"></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Taken</span></div>
                </div>
              </div>

              <div className="relative mb-24 px-4">
                <div className="w-full h-2 bg-gradient-to-r from-transparent via-rose-600 to-transparent shadow-[0_0_30px_rgba(225,29,72,0.6)] rounded-full mb-4"></div>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.6em] font-black opacity-50">Silver Screen</p>
              </div>

              <div className="flex flex-col items-center gap-6 overflow-x-auto pb-8">
                {ROWS.map(row => (
                  <div key={row} className="flex gap-4 sm:gap-6 items-center min-w-max">
                    <span className="w-6 text-slate-600 text-xs font-black">{row}</span>
                    <div className="flex gap-2 sm:gap-3">
                      {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const isBooked = showTime.availableSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl transition-all duration-300 transform active:scale-90 flex items-center justify-center border ${
                              isBooked ? 'bg-slate-800/20 border-transparent cursor-not-allowed opacity-20' :
                              isSelected ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/40 -translate-y-1' :
                              'bg-slate-900 border-white/5 text-slate-600 hover:border-rose-500/50 hover:text-white'
                            }`}
                          >
                            <span className="text-[10px] font-black">{i+1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-rose-600/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-xl shadow-rose-900/10">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white cinema-title">Secure Checkout</h2>
                    <p className="text-slate-500 font-medium">Instant verification via our simulated gateway</p>
                  </div>
               </div>

               <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl mb-12 flex items-start gap-5">
                  <div className="text-indigo-500 mt-1 flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-indigo-100 text-sm font-black uppercase tracking-widest mb-1">Demonstration Mode</p>
                    <p className="text-indigo-200/60 text-xs leading-relaxed">This is a mockup environment. Click the button on the right to simulate a successful payment. Use any fake details for the input fields.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Card Holder Name</label>
                      <input 
                        type="text" 
                        defaultValue="RAJ KUMAR"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-white font-black uppercase tracking-widest focus:border-rose-500 transition-colors"
                        placeholder="ENTER NAME"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Card Number</label>
                      <input 
                        type="text" 
                        defaultValue="4242 4242 4242 4242"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-rose-500 font-mono tracking-widest focus:border-rose-500 transition-colors"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="space-y-3 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Expiry</label>
                        <input type="text" defaultValue="12/28" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-white text-center font-bold" />
                     </div>
                     <div className="space-y-3 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">CVV</label>
                        <input type="text" defaultValue="123" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-white text-center font-bold" />
                     </div>
                     <div className="hidden md:block md:col-span-2"></div>
                  </div>
               </div>

               <div className="mt-12 flex items-center justify-center p-8 bg-slate-800/20 rounded-[2rem] border border-dashed border-white/10">
                  <div className="flex flex-col items-center gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                     <div className="flex gap-8">
                        <div className="w-12 h-8 bg-slate-700 rounded shadow-inner"></div>
                        <div className="w-12 h-8 bg-slate-700 rounded shadow-inner"></div>
                        <div className="w-12 h-8 bg-slate-700 rounded shadow-inner"></div>
                     </div>
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Payment Methods Encrypted</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-slate-900/80 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-2xl font-black text-white mb-8 pb-6 border-b border-white/5 cinema-title">Bill Summary</h3>
            
            <div className="flex gap-6 mb-10">
              <img src={movie?.posterUrl} alt={movie?.title} className="w-24 h-32 rounded-2xl shadow-xl border border-white/5 object-cover" />
              <div className="flex flex-col justify-center">
                <h4 className="text-xl font-black text-white mb-1 line-clamp-1">{movie?.title}</h4>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{theater?.name}</p>
                <div className="inline-flex bg-rose-600/20 text-rose-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {showTime.time}
                </div>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Seats Selected</span>
                <span className="text-white font-black">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'NONE'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tickets</span>
                <span className="text-white font-black">₹{showTime.price} x {selectedSeats.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Convenience Fee</span>
                <span className="text-white font-black">₹{selectedSeats.length > 0 ? 25 : 0}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/5 mb-10">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Payable Amount</span>
              <span className="text-4xl font-black text-rose-500 cinema-title">₹{totalPrice}</span>
            </div>

            {step === 'seats' ? (
              <button 
                onClick={() => setStep('payment')}
                disabled={selectedSeats.length === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl group overflow-hidden relative ${
                  selectedSeats.length > 0 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40 active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <span className="relative z-10">Proceed to Payment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            ) : (
              <div className="flex flex-col gap-5">
                <button 
                  onClick={handleConfirmBooking}
                  disabled={isProcessing}
                  className={`w-full relative overflow-hidden bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center justify-center gap-3 ${isProcessing ? 'cursor-wait opacity-80' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Pay with Fake Gateway'
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                <button 
                  onClick={() => setStep('seats')}
                  disabled={isProcessing}
                  className="w-full text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest text-center"
                >
                  Edit Seat Selection
                </button>
              </div>
            )}
            
            <p className="mt-8 text-[9px] text-slate-600 text-center leading-relaxed">
              * By clicking pay, you acknowledge this is a <span className="text-slate-400">test transaction</span> for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
