
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const PrivateRoute: React.FC<{ children: React.ReactNode; role?: 'admin' | 'customer' }> = ({ children, role }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col custom-scrollbar overflow-x-hidden">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/book/:showTimeId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="bg-rose-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CineBooking</span>
              </div>
              <div className="text-slate-500 text-sm">
                © 2024 CineBooking Platform. All cinematic rights reserved. Powered by Gemini AI.
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
