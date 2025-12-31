
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { getSmartRecommendation } from '../services/geminiService';

const Home: React.FC = () => {
  const { movies } = useApp();
  const [recommendation, setRecommendation] = useState<{ title: string; hook: string } | null>(null);
  const [filter, setFilter] = useState<'Now Showing' | 'Coming Soon'>('Now Showing');

  useEffect(() => {
    const fetchRec = async () => {
      const rec = await getSmartRecommendation(['Action', 'Indian Cinema', 'Drama']);
      setRecommendation(rec);
    };
    fetchRec();
  }, []);

  const filteredMovies = movies.filter(m => m.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero AI Section */}
      {recommendation && (
        <div className="relative mb-16 rounded-[2.5rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-[2s]"></div>
          
          <div className="relative z-20 p-10 md:p-16 max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-rose-600/20 text-rose-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-6 border border-rose-500/30">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              AI Movie Guru Suggestion
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white cinema-title mb-4 leading-tight">
              Craving some <span className="text-rose-500">Desi</span> Magic?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed italic opacity-90">
              "Based on your taste for grandeur, Gemini suggests you check out <span className="text-white font-black not-italic border-b-2 border-rose-600">{recommendation.title}</span>. {recommendation.hook}"
            </p>
            <div className="flex flex-wrap gap-4">
               <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-rose-900/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs">
                 View Recommendation
               </button>
               <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold backdrop-blur-md border border-white/10 transition-all uppercase tracking-widest text-xs">
                 Discover More
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-12 border-b border-white/5 mb-12">
        <button 
          onClick={() => setFilter('Now Showing')}
          className={`pb-6 font-black uppercase tracking-[0.2em] text-xs transition-all relative ${filter === 'Now Showing' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Now Showing
          {filter === 'Now Showing' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.8)]"></div>}
        </button>
        <button 
          onClick={() => setFilter('Coming Soon')}
          className={`pb-6 font-black uppercase tracking-[0.2em] text-xs transition-all relative ${filter === 'Coming Soon' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Coming Soon
          {filter === 'Coming Soon' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.8)]"></div>}
        </button>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredMovies.map(movie => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="group block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-rose-900/20 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-rose-500/30">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-70"></div>
              
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                 <div className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                    {movie.rating} IMDB
                 </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest">{movie.language}</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-1 group-hover:text-rose-400 transition-colors cinema-title">{movie.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1">{movie.genre.join(' • ')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
