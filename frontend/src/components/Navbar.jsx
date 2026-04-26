import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? 'bg-purple-600 text-white'
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">TokenTrackr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user?.role === 'student' && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={linkClass('/admin')}>Admin Panel</Link>
            )}
            <Link to="/wallet" className={linkClass('/wallet')}>Wallet</Link>
          </div>

          {/* User Info + Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600/30 border border-purple-500/50 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-slate-500 text-xs mt-1">ID: #{user?.id} • <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>
            <button
              id="navbar-logout"
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-white/10 pt-4">
            {user?.role === 'student' && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/dashboard')}`}>Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/admin')}`}>Admin Panel</Link>
            )}
            <Link to="/wallet" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/wallet')}`}>Wallet</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
