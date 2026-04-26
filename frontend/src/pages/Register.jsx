import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const roles = [
  { value: 'student', label: 'Student', icon: '🎓', desc: 'Earn tokens by attending class' },
  { value: 'admin',   label: 'Admin',   icon: '⚡', desc: 'Mark attendance and manage tokens' },
];

const passwordStrength = (pw) => {
  if (!pw)         return null;
  if (pw.length < 6)  return { label: 'Too short', color: 'bg-red-500',   text: 'text-red-500',   width: '25%' };
  if (pw.length < 8)  return { label: 'Weak',      color: 'bg-amber-500', text: 'text-amber-500', width: '50%' };
  if (pw.length < 12) return { label: 'Good',      color: 'bg-blue-500',  text: 'text-blue-500',  width: '75%' };
  return               { label: 'Strong',    color: 'bg-green-500', text: 'text-green-500', width: '100%' };
};

const Register = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldError('');

    try {
      /* 1 — Register the account */
      await api.post('/auth/register', formData);

      /* 2 — Immediately log in with the same credentials */
      const loginRes = await api.post('/auth/login', {
        email:    formData.email,
        password: formData.password,
      });

      /* 3 — Store token + user, then redirect based on role */
      const { token, user } = loginRes.data;
      login(token, user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setFieldError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(formData.password);

  const inputCls =
    'w-full pl-11 pr-4 py-3.5 bg-theme-input border border-theme focus:border-purple-400 ' +
    'rounded-xl text-theme-main placeholder:text-theme-muted focus:outline-none focus:ring-2 ' +
    'focus:ring-purple-500/20 transition-all';

  return (
    <div className="min-h-screen bg-theme-page flex transition-all duration-300">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: isDark ? 'linear-gradient(135deg,#0f172a,#020617)' : 'linear-gradient(135deg,#eff6ff,#f8fafc)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10 max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-theme-main mb-4">
            Join <span className="text-purple-500">TokenTrackr</span>
          </h2>
          <p className="text-theme-sub text-lg leading-relaxed mb-8">
            Create your account and start turning attendance into tangible rewards.
          </p>
          <div className="space-y-3">
            {['Free to join — no credit card needed', 'Instant token wallet on registration', 'Secure JWT authentication', 'Role-based access control'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-theme-sub text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-theme-muted hover:text-purple-500 text-sm transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
            <button onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-theme bg-theme-card2 text-theme-sub hover:text-purple-500 hover:border-purple-400 transition-all">
              {isDark
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>
          </div>

          <h1 className="text-3xl font-black text-theme-main mb-2">Create Account</h1>
          <p className="text-theme-sub mb-8">Join TokenTrackr and start earning rewards</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Full Name ── */}
            <div className="group">
              <label className="block text-sm font-semibold text-theme-sub mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-purple-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input id="register-name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputCls} />
              </div>
            </div>

            {/* ── Email ── */}
            <div className="group">
              <label className="block text-sm font-semibold text-theme-sub mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-purple-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input id="register-email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputCls} />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="group">
              <label className="block text-sm font-semibold text-theme-sub mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-purple-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input id="register-password" type={showPw ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 characters"
                  className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted hover:text-purple-500 transition-colors">
                  {showPw
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-theme-muted">Password strength</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-theme-card2 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Role selector ── */}
            <div>
              <label className="block text-sm font-semibold text-theme-sub mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button key={r.value} type="button" onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                      formData.role === r.value
                        ? 'border-purple-500 bg-purple-500/10 shadow-md shadow-purple-500/10'
                        : 'border-theme bg-theme-card2 hover:border-purple-400/40'
                    }`}>
                    <div className="text-2xl mb-2">{r.icon}</div>
                    <div className="text-theme-main font-bold text-sm">{r.label}</div>
                    <div className="text-theme-muted text-xs mt-1">{r.desc}</div>
                    {formData.role === r.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Inline error (no popup) ── */}
            {fieldError && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {fieldError}
              </p>
            )}

            {/* ── Submit ── */}
            <button id="register-submit" type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center gap-3">
              {loading
                ? <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating &amp; signing in...</>
                : <>Create Account <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              }
            </button>
          </form>

          <p className="text-center text-theme-muted text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-500 hover:text-purple-400 font-semibold transition-colors">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
