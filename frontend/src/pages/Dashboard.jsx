import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`group rounded-2xl p-6 border border-theme shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-theme-card`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-theme-sub text-sm">{label}</p>
        <p className="text-3xl font-black text-theme-main">{value}</p>
        <p className="text-xs mt-0.5 text-theme-muted">{sub}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({ total_count: 0, attendance: [] });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          api.get(`/attendance/${user.id}`),
          api.get('/tokens/balance'),
        ]);
        setAttendanceData(aRes.data);
        setBalance(bRes.data.balance);
      } catch { setError('Failed to load dashboard data.'); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-theme-page transition-all duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting + ID */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-theme-main">
              Welcome back, <span className="text-purple-500">{user?.name}</span> 👋
            </h1>
            <p className="text-theme-sub mt-1">Here's your attendance and token summary</p>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-purple-600/20 border border-purple-500/30 rounded-2xl">
            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Your Student ID</span>
            <span className="text-2xl font-black text-theme-main">#{user?.id}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <StatCard icon="📅" label="Total Attendance" value={attendanceData.total_count} sub="days present"   color="bg-blue-500/20" />
              <StatCard icon="💰" label="Token Balance"    value={balance}                   sub="tokens available" color="bg-purple-500/20" />
              <StatCard icon="📈" label="Tokens Earned"    value={attendanceData.total_count * 10} sub="10 per day" color="bg-green-500/20" />
            </div>

            <div className="flex gap-3 mb-8">
              <Link to="/wallet" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 hover:scale-[1.02] flex items-center gap-2">
                💳 Redeem Tokens
              </Link>
            </div>

            <div className="bg-theme-card border border-theme rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-theme-main">Recent Attendance</h2>
                  <p className="text-theme-sub text-sm">Last 5 records</p>
                </div>
                <span className="text-xs bg-theme-card2 text-theme-sub px-3 py-1 rounded-full font-medium border border-theme">{attendanceData.total_count} total</span>
              </div>
              {attendanceData.attendance.length === 0 ? (
                <div className="px-6 py-12 text-center text-theme-muted">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-medium text-theme-sub">No attendance records yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-theme-card2">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">Tokens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.attendance.slice(0, 5).map((r) => (
                        <tr key={r.id} className="border-t border-theme hover:bg-theme-card2 transition-colors">
                          <td className="px-6 py-4 text-sm text-theme-main font-medium">{fmt(r.date)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />{r.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-purple-400 font-bold">+{r.tokens_awarded}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
