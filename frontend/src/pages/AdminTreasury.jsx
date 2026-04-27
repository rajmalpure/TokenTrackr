import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminTreasury = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTreasury = async () => {
      try {
        const res = await api.get('/tokens/treasury');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load treasury data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTreasury();
  }, []);

  const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-theme-page transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-theme-main">Treasury 🏛️</h1>
          <p className="text-theme-sub mt-1">Global ecosystem overview and redemption audit</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">{error}</div>
        ) : (
          <>
            {/* Global Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-sm">
                <p className="text-theme-sub text-xs font-bold uppercase tracking-widest mb-1">Total Issued</p>
                <p className="text-4xl font-black text-purple-500">{stats.total_awarded.toLocaleString()}</p>
                <p className="text-theme-muted text-xs mt-2">Tokens awarded for attendance</p>
              </div>
              <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-sm">
                <p className="text-theme-sub text-xs font-bold uppercase tracking-widest mb-1">Total Redeemed</p>
                <p className="text-4xl font-black text-blue-500">{stats.total_spent.toLocaleString()}</p>
                <p className="text-theme-muted text-xs mt-2">Tokens exchanged for rewards</p>
              </div>
              <div className="bg-theme-card border border-theme p-6 rounded-2xl shadow-sm">
                <p className="text-theme-sub text-xs font-bold uppercase tracking-widest mb-1">Circulating Supply</p>
                <p className="text-4xl font-black text-green-500">{stats.circulating_supply.toLocaleString()}</p>
                <p className="text-theme-muted text-xs mt-2">Currently in student wallets</p>
              </div>
            </div>

            {/* Audit Log */}
            <div className="bg-theme-card border border-theme rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
                <h2 className="text-lg font-bold text-theme-main">Global Redemption Log</h2>
                <span className="text-xs font-bold bg-theme-card2 px-2.5 py-1 rounded-full border border-theme text-theme-sub">
                  {stats.redemptions.length} events
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-theme-card2">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-theme-muted uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-theme-muted uppercase">Reward</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-theme-muted uppercase">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-theme-muted uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {stats.redemptions.map((r) => (
                      <tr key={r.id} className="hover:bg-theme-card2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-theme-main">{r.student_name}</div>
                          <div className="text-xs text-theme-muted">ID: #{r.user_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {r.reward_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-red-400">-{r.tokens_used}</td>
                        <td className="px-6 py-4 text-xs text-theme-sub">{fmtDate(r.redeemed_at)}</td>
                      </tr>
                    ))}
                    {stats.redemptions.length === 0 && (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-theme-muted">No redemptions found in the system.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminTreasury;
