
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-gradient-to-tr from-rose-600 to-rose-400 p-2.5 rounded-2xl shadow-lg shadow-rose-900/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <span className="text-2xl font-black tracking-tight text-white cinema-title group-hover:text-rose-500 transition-colors">CineBooking</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Movies</Link>
        {currentUser ? (
          <>
            {currentUser.role === 'admin' && (
              <Link to="/admin" className="text-sm font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest">Admin</Link>
            )}
            <Link to="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Bookings</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Namaste,</span>
                <span className="text-xs font-black text-white">{currentUser.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-white p-2 rounded-xl transition-all"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-2.5 rounded-2xl font-black shadow-lg shadow-rose-900/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
