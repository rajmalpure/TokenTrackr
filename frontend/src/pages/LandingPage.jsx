import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/* ── Count-Up component ── */
const CountUp = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let n = 0;
    const step = end / 60;
    const t = setInterval(() => { n += step; if (n >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(n)); }, 16);
    return () => clearInterval(t);
  }, [started, end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Feature Card ── */
const features = [
  {
    emoji: '✅',
    title: 'Smart Attendance Tracking',
    desc: 'Admins mark attendance with a single click. The system automatically prevents duplicate entries for the same date. Every successful mark instantly awards exactly 10 tokens to the student\'s wallet.',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    emoji: '💰',
    title: 'Live Token Wallet',
    desc: 'Students get a real-time wallet dashboard showing their current balance, full attendance history with dates, and a detailed redemption transaction log — all updated instantly on every action.',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    emoji: '🎁',
    title: 'Instant Reward Redemption',
    desc: 'Exchange accumulated tokens for 3 types of academic rewards: Certificates of Merit, Priority Seating in class, or Exam Fee Waivers. Transactions use row-level locking to prevent any race conditions.',
    gradient: 'from-violet-500 to-violet-700',
  },
  {
    emoji: '🔒',
    title: 'Role-Based Security',
    desc: 'Every route is guarded by JWT authentication. Admin accounts exclusively manage attendance marking, while student accounts are isolated to their own data only. Tokens expire after 7 days for security.',
    gradient: 'from-green-500 to-green-700',
  },
  {
    emoji: '📊',
    title: 'Analytics at a Glance',
    desc: 'The student dashboard shows attendance count, total tokens earned over time, current spendable balance, a progress bar, and a sortable table of the last 5 attendance records — no manual calculations needed.',
    gradient: 'from-amber-500 to-amber-700',
  },
  {
    emoji: '🚀',
    title: 'Production-Ready Infrastructure',
    desc: 'Ships with a Docker Compose setup for one-command local launches and 7 Kubernetes manifests for cloud deployment — including liveness probes, resource limits, PVC storage, Ingress routing, and a full CI/CD GitHub Actions pipeline.',
    gradient: 'from-rose-500 to-rose-700',
  },
];

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">

      {/* ── Animated Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:opacity-100 opacity-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-slate-900 dark:text-white font-black text-xl">Token<span className="text-purple-500">Trackr</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works'].map((s) => (
              <a key={s} href={`#${s.toLowerCase().replace(/ /g, '-')}`} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">{s}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
            >
              {isDark
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>
            <Link to="/login" className="hidden md:block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Attendance Incentive Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
            Reward Every
            <span className="block bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Attendance with
            </span>
            Real Tokens
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            TokenTrackr transforms student attendance into a rewarding experience. Earn tokens for showing up, redeem them for real academic benefits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-3">
              Start Earning Tokens
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link to="/login" className="px-8 py-4 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-semibold text-lg rounded-2xl transition-all">
              Sign In
            </Link>
          </div>

          {/* Preview cards */}
          <div className="relative max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Tokens Per Day', value: '+10', sub: 'per attendance mark', grad: 'from-purple-500/10 to-purple-600/10', border: 'border-purple-300 dark:border-purple-500/30', text: 'text-purple-600 dark:text-purple-400' },
                { label: 'Current Balance', value: '150', sub: 'tokens available', grad: 'from-blue-500/10 to-blue-600/10', border: 'border-blue-300 dark:border-blue-500/30', text: 'text-blue-600 dark:text-blue-400' },
                { label: 'Reward Types', value: '3', sub: 'Certificate · Seat · Fee', grad: 'from-violet-500/10 to-violet-600/10', border: 'border-violet-300 dark:border-violet-500/30', text: 'text-violet-600 dark:text-violet-400' },
              ].map((c, i) => (
                <div key={i} className={`bg-gradient-to-br ${c.grad} border ${c.border} rounded-2xl p-5 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-2">{c.label}</p>
                  <p className={`text-3xl font-black ${c.text} mb-1`}>{c.value}</p>
                  <p className="text-slate-500 text-xs">{c.sub}</p>
                </div>
              ))}
            </div>
            <div className="absolute -top-6 -left-6 bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/40 rounded-xl px-4 py-2 text-green-700 dark:text-green-400 text-sm font-bold animate-float hidden md:block">✅ Attendance Marked!</div>
            <div className="absolute -bottom-6 -right-6 bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/40 rounded-xl px-4 py-2 text-purple-700 dark:text-purple-400 text-sm font-bold animate-float hidden md:block" style={{ animationDelay: '1s' }}>🏆 Reward Redeemed!</div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 shadow-xl dark:shadow-none">
            {[
              { end: 10, suffix: '+', label: 'Tokens Per Day', icon: '⚡' },
              { end: 3, suffix: '', label: 'Reward Types', icon: '🏆' },
              { end: 100, suffix: '%', label: 'Attendance Tracked', icon: '📊' },
              { end: 0, suffix: ' Manual Work', label: 'Setup Required', icon: '🤖' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform inline-block">{s.icon}</div>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              A complete token-based incentive system built for modern educational institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-300 dark:hover:border-purple-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg text-2xl`}>
                  {f.emoji}
                </div>
                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Three simple steps to start earning rewards</p>
          </div>

          <div className="space-y-0">
            {[
              { n: '01', icon: '📝', title: 'Register Your Account', desc: 'Create a free account choosing the Student or Admin role. Students automatically receive an empty token wallet, and Admins get access to the attendance marking panel immediately after signup.' },
              { n: '02', icon: '✅', title: 'Admin Marks Attendance', desc: 'Each day a student is present, the Admin marks them using their unique Student ID in the Admin Panel. 10 tokens are atomically credited to the student\'s wallet within milliseconds — no manual math needed.' },
              { n: '03', icon: '🎁', title: 'Redeem Your Tokens', desc: 'Students visit their Token Wallet and spend accumulated tokens on real academic perks: a Certificate of Merit, Priority Seating at the front, or an Exam Fee Waiver. Redemptions are recorded with timestamps for full audit trails.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-0">
                <div className="flex flex-col items-center mr-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform flex-shrink-0">
                    {step.n}
                  </div>
                  {i < 2 && <div className="w-0.5 h-16 bg-gradient-to-b from-purple-500/50 to-transparent mt-2" />}
                </div>
                <div className="pb-12 pt-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.icon} {step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-700 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl shadow-purple-500/30">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to Start Earning?</h2>
              <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
                Join TokenTrackr today. Show up, earn tokens, redeem rewards. It's that simple.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="group px-8 py-4 bg-white text-purple-700 hover:bg-purple-50 font-bold text-lg rounded-2xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3">
                  Create Free Account
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-lg rounded-2xl transition-all">
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
            </div>
            <span className="text-slate-900 dark:text-white font-bold">Token<span className="text-purple-500">Trackr</span></span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 TokenTrackr · Token-Based Attendance Incentive System</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-500 hover:text-purple-500 text-sm transition-colors">Sign In</Link>
            <Link to="/register" className="text-slate-500 hover:text-purple-500 text-sm transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
