import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ user_id: '', date: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [recentMarked, setRecentMarked] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await api.post('/attendance/mark', {
        user_id: parseInt(formData.user_id, 10),
        date: formData.date,
      });
      setMessage({ text: `Attendance marked! +10 tokens awarded to Student #${formData.user_id}`, type: 'success' });
      setRecentMarked((prev) => [response.data.attendance, ...prev].slice(0, 10));
      setFormData({ user_id: '', date: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Panel ⚡</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Mark student attendance and award tokens</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-amber-700 dark:text-amber-400 text-xs font-semibold">Logged in as {user?.name} (Admin)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mark Attendance Form */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span> Mark Attendance
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {message.text && (
                <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
                }`}>
                  <span className="text-lg flex-shrink-0">{message.type === 'success' ? '✅' : '❌'}</span>
                  {message.text}
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Student User ID</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <span className="font-bold text-sm">#</span>
                  </div>
                  <input
                    id="admin-user-id"
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter student user ID"
                    className="w-full pl-8 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">Ask the student to check their Dashboard for their ID number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attendance Date</label>
                <input
                  id="admin-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <button
                id="admin-mark-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Marking...</>
                ) : (
                  <><span>✅</span> Mark Attendance & Award 10 Tokens</>
                )}
              </button>
            </form>

            {/* Info box */}
            <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-start gap-3">
              <span className="text-lg">ℹ️</span>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Each attendance mark awards <strong>10 tokens</strong> to the student's wallet. Duplicate entries for the same user/date are automatically rejected.
              </p>
            </div>
          </div>

          {/* Session Activity Log */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Session Activity</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Attendance marked this session</p>
              </div>
              {recentMarked.length > 0 && (
                <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-bold px-2.5 py-1 rounded-full">{recentMarked.length}</span>
              )}
            </div>
            {recentMarked.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="text-4xl mb-3">📂</div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No records yet this session</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Records will appear here after you mark attendance</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {recentMarked.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-bold">#{r.user_id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(r.date)}</td>
                        <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-bold">+{r.tokens_awarded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
