
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { getMovieTrivia } from '../services/geminiService';

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const { movies, showTimes, theaters } = useApp();
  const [trivia, setTrivia] = useState<string[]>([]);
  const movie = movies.find(m => m.id === id);

  useEffect(() => {
    if (movie) {
      const fetchTrivia = async () => {
        const data = await getMovieTrivia(movie.title);
        setTrivia(data);
      };
      fetchTrivia();
    }
  }, [movie]);

  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  const movieShowtimes = showTimes.filter(st => st.movieId === movie.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-2xl shadow-2xl border border-slate-800" />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-bold uppercase tracking-widest">Top Rated</span>
            <span className="text-slate-400 font-medium">{movie.duration} min • {movie.language}</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genre.map(g => (
              <span key={g} className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-full text-sm border border-slate-700">{g}</span>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-3">The Storyline</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{movie.description}</p>
          </div>

          <div className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              AI Cinema Insights (Trivia)
            </h3>
            <ul className="space-y-3">
              {trivia.length > 0 ? trivia.map((t, i) => (
                <li key={i} className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 font-bold">•</span>
                  {t}
                </li>
              )) : (
                <div className="animate-pulse flex space-y-2 flex-col">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </div>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Select a Show</h3>
            <div className="space-y-6">
              {theaters.map(theater => {
                const showsForTheater = movieShowtimes.filter(st => st.theaterId === theater.id);
                if (showsForTheater.length === 0) return null;
                return (
                  <div key={theater.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
                    <div className="bg-slate-800 px-6 py-3 flex justify-between items-center">
                      <span className="font-bold text-white">{theater.name}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest">{theater.location}</span>
                    </div>
                    <div className="p-6 flex flex-wrap gap-4">
                      {showsForTheater.map(st => (
                        <Link 
                          key={st.id} 
                          to={`/book/${st.id}`}
                          className="bg-slate-800 hover:bg-rose-600 border border-slate-700 text-white px-6 py-3 rounded-lg flex flex-col items-center transition-all group"
                        >
                          <span className="text-lg font-bold group-hover:scale-110 transition-transform">{st.time}</span>
                          <span className="text-xs text-slate-400 group-hover:text-rose-100">${st.price.toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
