
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Movie } from '../types';

const AdminDashboard: React.FC = () => {
  const { movies, bookings, deleteMovie, addMovie } = useApp();
  const [activeTab, setActiveTab] = useState<'movies' | 'stats'>('movies');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: '',
    genre: ['Action'],
    duration: 120,
    language: 'English',
    releaseDate: '2024-12-01',
    rating: 8.0,
    description: '',
    posterUrl: 'https://picsum.photos/seed/newmovie/800/1200',
    status: 'Now Showing'
  });

  const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const movie: Movie = {
      ...newMovie as Movie,
      id: 'm' + Math.random().toString(36).substr(2, 5)
    };
    addMovie(movie);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Management Center</h1>
          <p className="text-slate-500">Oversee your movie theater operations</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab('movies')}
             className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'movies' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}
           >
             Inventory
           </button>
           <button 
             onClick={() => setActiveTab('stats')}
             className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}
           >
             Performance
           </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Total Revenue</span>
              <span className="text-4xl font-black text-white">${totalRevenue.toFixed(2)}</span>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Tickets Sold</span>
              <span className="text-4xl font-black text-white">{bookings.length}</span>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Active Movies</span>
              <span className="text-4xl font-black text-white">{movies.length}</span>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white">Current Listings</h3>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add New Movie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex shadow-lg">
                <img src={movie.posterUrl} className="w-24 object-cover" alt={movie.title} />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold leading-tight">{movie.title}</h4>
                    <p className="text-xs text-slate-500">{movie.genre.join(', ')}</p>
                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${movie.status === 'Now Showing' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {movie.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteMovie(movie.id)}
                    className="text-rose-500 text-xs font-bold hover:text-rose-400 transition-colors self-start mt-4"
                  >
                    Remove Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplified Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center px-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">Register New Movie</h2>
            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-bold uppercase block mb-1">Movie Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  value={newMovie.title}
                  onChange={e => setNewMovie({...newMovie, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-bold uppercase block mb-1">Duration (min)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    value={newMovie.duration}
                    onChange={e => setNewMovie({...newMovie, duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-bold uppercase block mb-1">Rating</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    value={newMovie.rating}
                    onChange={e => setNewMovie({...newMovie, rating: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs font-bold uppercase block mb-1">Synopsis</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white resize-none"
                  value={newMovie.description}
                  onChange={e => setNewMovie({...newMovie, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
