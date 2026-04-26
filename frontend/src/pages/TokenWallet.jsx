import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const REWARDS = [
  { value: 'Certificate', label: 'Certificate of Merit', icon: '🏆', desc: 'Official recognition of outstanding attendance' },
  { value: 'Priority Seating', label: 'Priority Seating', icon: '🪑', desc: 'Front row seat reserved for you' },
  { value: 'Exam Fee Waiver', label: 'Exam Fee Waiver', icon: '💸', desc: 'Full waiver on your next exam fee' },
];

const TokenWallet = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tokens_to_use: '', reward_type: 'Certificate' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [redeemLoading, setRedeemLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [bRes, hRes] = await Promise.all([api.get('/tokens/balance'), api.get('/tokens/history')]);
      setBalance(bRes.data.balance);
      setHistory(hRes.data.history);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setMsg({ text: '', type: '' }); };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.post('/tokens/redeem', { tokens_to_use: parseInt(form.tokens_to_use, 10), reward_type: form.reward_type });
      setBalance(res.data.new_balance);
      setMsg({ text: `Successfully redeemed ${form.tokens_to_use} tokens for "${form.reward_type}"!`, type: 'success' });
      setForm({ tokens_to_use: '', reward_type: 'Certificate' });
      const hRes = await api.get('/tokens/history');
      setHistory(hRes.data.history);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Redemption failed', type: 'error' });
    } finally {
      setRedeemLoading(false);
    }
  };

  const fmt = (dt) => new Date(dt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const getIcon = (t) => REWARDS.find((r) => r.value === t)?.icon || '🎁';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Token Wallet 💰</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and redeem your earned tokens</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : (
          <>
            {/* Balance Hero */}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 rounded-3xl p-8 mb-8 shadow-2xl shadow-purple-500/20 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-2">Current Balance</p>
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-black text-white">{balance}</span>
                    <span className="text-2xl text-purple-200 mb-2">tokens</span>
                  </div>
                  <div className="mt-3 w-64 max-w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min((balance / 200) * 100, 100)}%` }} />
                  </div>
                  <p className="text-purple-200 text-xs mt-1">{balance}/200 tokens to max milestone</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {REWARDS.map((r) => (
                    <div key={r.value} className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center hover:bg-white/25 transition-colors cursor-pointer" onClick={() => setForm({ ...form, reward_type: r.value })}>
                      <div className="text-2xl mb-1">{r.icon}</div>
                      <div className="text-white text-xs font-semibold leading-tight">{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Redeem Form */}
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎁</span> Redeem Tokens
                </h2>

                <form onSubmit={handleRedeem} className="space-y-5">
                  {msg.text && (
                    <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border ${
                      msg.type === 'success'
                        ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
                    }`}>
                      <span className="text-lg">{msg.type === 'success' ? '✅' : '❌'}</span>
                      {msg.text}
                    </div>
                  )}

                  {/* Reward Type visual selector */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Select Reward</label>
                    <div className="space-y-2">
                      {REWARDS.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setForm({ ...form, reward_type: r.value })}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] flex items-center gap-4 ${
                            form.reward_type === r.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-sm'
                              : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl">{r.icon}</span>
                          <div className="flex-1">
                            <div className="text-slate-900 dark:text-white font-semibold text-sm">{r.label}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{r.desc}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.reward_type === r.value ? 'border-purple-500 bg-purple-500' : 'border-slate-300 dark:border-slate-600'}`}>
                            {form.reward_type === r.value && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tokens to Use</label>
                    <input
                      id="redeem-tokens"
                      type="number"
                      name="tokens_to_use"
                      value={form.tokens_to_use}
                      onChange={handleChange}
                      required
                      min="1"
                      max={balance}
                      placeholder={`Enter amount (max: ${balance})`}
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">Available balance: <strong className="text-purple-600 dark:text-purple-400">{balance} tokens</strong></p>
                  </div>

                  <button
                    id="redeem-submit"
                    type="submit"
                    disabled={redeemLoading || balance === 0}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-400 dark:disabled:from-slate-700 disabled:to-slate-400 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                  >
                    {redeemLoading ? <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</> : <><span>✨</span> Redeem Now</>}
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Redemption History</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{history.length} total redemptions</p>
                  </div>
                </div>
                {history.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <div className="text-4xl mb-3">🎁</div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No redemptions yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Use the form to redeem your tokens</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center text-xl">{getIcon(item.reward_type)}</div>
                          <div>
                            <p className="text-slate-900 dark:text-white text-sm font-semibold">{item.reward_type}</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">{fmt(item.redeemed_at)}</p>
                          </div>
                        </div>
                        <span className="text-red-500 dark:text-red-400 font-bold text-sm">-{item.tokens_used}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TokenWallet;
