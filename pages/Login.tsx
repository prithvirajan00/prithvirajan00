
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, role);
      navigate(role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <div className="bg-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-900/20">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your CineBooking account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${role === 'customer' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Customer
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${role === 'admin' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-900/40 transition-all transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">Don't have an account? <span className="text-rose-500 font-bold cursor-pointer hover:underline">Create one</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
