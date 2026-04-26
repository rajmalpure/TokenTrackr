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
      setMessage({ text: `✅ Attendance marked! +10 tokens awarded to User #${formData.user_id}`, type: 'success' });
      setRecentMarked((prev) => [response.data.attendance, ...prev].slice(0, 10));
      setFormData({ user_id: '', date: '' });
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to mark attendance';
      setMessage({ text: `❌ ${errMsg}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Admin Panel <span className="text-amber-400">⚡</span>
          </h1>
          <p className="text-slate-400 mt-1">Mark student attendance and award tokens</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            <span className="text-amber-400 text-xs font-medium">Logged in as: {user?.name} (Admin)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mark Attendance Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Mark Attendance
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {message.text && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm border ${
                    message.type === 'success'
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-red-500/20 border-red-500/50 text-red-300'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Student User ID</label>
                <input
                  id="admin-user-id"
                  type="number"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter student user ID"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <p className="text-slate-500 text-xs mt-1">The numeric ID of the student in the system</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Attendance Date</label>
                <input
                  id="admin-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <button
                id="admin-mark-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Marking...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark Attendance & Award Tokens
                  </>
                )}
              </button>
            </form>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-300 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Each attendance mark awards <strong className="text-blue-200">10 tokens</strong> to the student's wallet. Duplicate entries for the same user/date are rejected.
              </p>
            </div>
          </div>

          {/* Recent Marked Records */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Session Activity</h2>
              <p className="text-slate-400 text-sm">Attendance marked this session</p>
            </div>

            {recentMarked.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No records marked yet this session</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentMarked.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-sm text-white font-medium">#{record.user_id}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{formatDate(record.date)}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-medium">+{record.tokens_awarded}</td>
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
