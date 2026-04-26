import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const StatCard = ({ icon, label, value, sub, iconBg, iconColor }) => (
  <div className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-purple-500/5 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <span className={`text-xl ${iconColor}`}>{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className={`text-xs mt-0.5 ${iconColor}`}>{sub}</p>
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
    const fetchData = async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          api.get(`/attendance/${user.id}`),
          api.get('/tokens/balance'),
        ]);
        setAttendanceData(aRes.data);
        setBalance(bRes.data.balance);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting + ID Badge */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Welcome back, <span className="text-purple-500">{user?.name}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your attendance and token summary</p>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 rounded-2xl">
            <span className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">Your Student ID</span>
            <span className="text-2xl font-black text-purple-700 dark:text-white">#{user?.id}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              <p className="text-slate-500 dark:text-slate-400">Loading your data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl p-4">{error}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <StatCard icon="📅" label="Total Attendance" value={attendanceData.total_count} sub="days present" iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400" />
              <StatCard icon="💰" label="Token Balance" value={balance} sub="tokens available" iconBg="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-600 dark:text-purple-400" />
              <StatCard icon="📈" label="Tokens Earned" value={attendanceData.total_count * 10} sub="10 per day" iconBg="bg-green-100 dark:bg-green-500/20" iconColor="text-green-600 dark:text-green-400" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
              <Link to="/wallet" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center gap-2">
                <span>💳</span> Redeem Tokens
              </Link>
            </div>

            {/* Attendance Table */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Attendance</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Last 5 records</p>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full font-medium">{attendanceData.total_count} total</span>
              </div>
              {attendanceData.attendance.slice(0, 5).length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-medium">No attendance records yet</p>
                  <p className="text-sm mt-1">Your records will appear here once an admin marks you present</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/5">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tokens Awarded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {attendanceData.attendance.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{formatDate(r.date)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-purple-600 dark:text-purple-400 font-bold">+{r.tokens_awarded}</td>
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
