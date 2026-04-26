import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300
        bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-purple-500
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:border-purple-500
        light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:text-slate-900 light:hover:border-purple-400
        hover:bg-purple-600/10 hover:scale-105"
    >
      {isDark ? (
        /* Sun icon — shown in dark mode to switch to light */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
      ) : (
        /* Moon icon — shown in light mode to switch to dark */
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
    }`;

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-slate-900 dark:text-white font-black text-lg">
              Token<span className="text-purple-500">Trackr</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {user?.role === 'student' && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={linkClass('/admin')}>Admin Panel</Link>
            )}
            <Link to="/wallet" className={linkClass('/wallet')}>Wallet</Link>
          </div>

          {/* Right: User Info + Theme Toggle + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-slate-900 dark:text-white text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-0.5">ID: #{user?.id} · <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>

            <button
              id="navbar-logout"
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 rounded-lg transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile: Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-slate-200 dark:border-white/10 pt-3">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-semibold">{user?.name}</p>
                <p className="text-slate-500 text-xs">ID: #{user?.id} · <span className="capitalize">{user?.role}</span></p>
              </div>
            </div>
            {user?.role === 'student' && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/dashboard')}`}>Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/admin')}`}>Admin Panel</Link>
            )}
            <Link to="/wallet" onClick={() => setMobileOpen(false)} className={`block ${linkClass('/wallet')}`}>Wallet</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
