import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const REWARDS = [
  { value: 'Certificate', label: 'Certificate of Merit', icon: '🏆', desc: 'Official recognition of outstanding attendance', cost: 100 },
  { value: 'Priority Seating', label: 'Priority Seating', icon: '🪑', desc: 'Front row seat reserved for you', cost: 50 },
  { value: 'Exam Fee Waiver', label: 'Exam Fee Waiver', icon: '💸', desc: 'Full waiver on your next exam fee', cost: 200 },
];

const StudentVault = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tokens_to_use: '', reward_type: 'Certificate' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [redeemLoading, setRedeemLoading] = useState(false);

  // Gamification logic
  const getLevel = (bal) => {
    if (bal >= 500) return { name: 'Platinum Scholar', color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30' };
    if (bal >= 200) return { name: 'Gold Tier Student', color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/30' };
    if (bal >= 100) return { name: 'Silver Academic', color: 'text-slate-300', bg: 'bg-slate-300/20', border: 'border-slate-300/30' };
    return { name: 'Bronze Learner', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/30' };
  };

  const fetchData = async () => {
    try {
      const [bRes, hRes, lRes] = await Promise.all([
        api.get('/tokens/balance'),
        api.get('/tokens/history'),
        api.get('/tokens/leaderboard')
      ]);
      setBalance(bRes.data.balance);
      setHistory(hRes.data.history);
      setLeaderboard(lRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.post('/tokens/redeem', { 
        tokens_to_use: parseInt(form.tokens_to_use, 10), 
        reward_type: form.reward_type 
      });
      setBalance(res.data.new_balance);
      setMsg({ text: `Success! Redeemed for ${form.reward_type}`, type: 'success' });
      setForm({ tokens_to_use: '', reward_type: 'Certificate' });
      fetchData();
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Redemption failed', type: 'error' });
    } finally {
      setRedeemLoading(false);
    }
  };

  const level = getLevel(balance);
  const fmt = (dt) => new Date(dt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-theme-page transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-theme-main">The Vault 💰</h1>
            <p className="text-theme-sub mt-1">Manage your academic earnings and unlock rewards</p>
          </div>
          {/* Level Badge */}
          <div className={`px-4 py-2 rounded-2xl border ${level.border} ${level.bg} flex items-center gap-3 animate-float`}>
            <div className="text-2xl">🏆</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-theme-muted mb-0.5">Your Rank</p>
              <p className={`text-sm font-black ${level.color}`}>{level.name}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><svg className="animate-spin h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Balance & Leaderboard */}
            <div className="lg:col-span-4 space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/30">
                <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-4">Current Balance</p>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-6xl font-black">{balance}</span>
                  <span className="text-xl text-purple-200 mb-2 font-bold">TKNS</span>
                </div>
                {/* Progress to next level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-purple-200 uppercase">
                    <span>Next Rank Progress</span>
                    <span>{balance}/500</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min((balance/500)*100, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Leaderboard Card */}
              <div className="bg-theme-card border border-theme rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-theme bg-theme-card2">
                  <h2 className="text-sm font-bold text-theme-main uppercase tracking-widest">Global Top 5 🏆</h2>
                </div>
                <div className="divide-y divide-theme">
                  {leaderboard.slice(0, 5).map((u, i) => (
                    <div key={u.id} className="px-6 py-3 flex items-center justify-between group hover:bg-theme-card2 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black w-5 ${i === 0 ? 'text-amber-400' : 'text-theme-muted'}`}>{i + 1}</span>
                        <div className="text-sm font-bold text-theme-main group-hover:text-purple-500 transition-colors">{u.name}</div>
                      </div>
                      <div className="text-xs font-black text-theme-sub">{u.balance} TKNS</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Redemptions & History */}
            <div className="lg:col-span-8 space-y-6">
              {/* Redeem Form */}
              <div className="bg-theme-card border border-theme rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-theme-main mb-6 flex items-center gap-3">
                  <span className="text-2xl">🎁</span> Redeem Rewards
                </h2>
                
                <form onSubmit={handleRedeem} className="space-y-6">
                  {msg.text && (
                    <div className={`text-sm p-3 rounded-xl border ${msg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {msg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {REWARDS.map((r) => (
                      <button
                        key={r.value} type="button"
                        onClick={() => setForm({ reward_type: r.value, tokens_to_use: r.cost })}
                        className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                          form.reward_type === r.value ? 'border-purple-500 bg-purple-500/5 shadow-lg' : 'border-theme bg-theme-card2 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{r.icon}</div>
                        <div className="font-bold text-theme-main text-sm mb-1">{r.label}</div>
                        <div className="text-purple-500 font-black text-xs">{r.cost} Tokens</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-theme-muted uppercase mb-2">Cost (Automatic)</label>
                      <input 
                        type="number" readOnly value={form.tokens_to_use} 
                        className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-theme-main outline-none focus:border-purple-500" 
                      />
                    </div>
                    <button
                      type="submit" disabled={redeemLoading || balance < form.tokens_to_use}
                      className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 mt-6"
                    >
                      {redeemLoading ? 'Processing...' : 'Confirm Redemption ✨'}
                    </button>
                  </div>
                </form>
              </div>

              {/* History Table */}
              <div className="bg-theme-card border border-theme rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-4 border-b border-theme bg-theme-card2 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-theme-main uppercase tracking-widest">Transaction History</h2>
                  <span className="text-[10px] font-bold text-theme-muted">{history.length} Transactions</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-theme">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-theme-card2 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-theme-main">{item.reward_type}</td>
                          <td className="px-8 py-4 text-xs text-theme-muted">{fmt(item.redeemed_at)}</td>
                          <td className="px-8 py-4 text-sm font-black text-red-400 text-right">-{item.tokens_used}</td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr><td className="px-8 py-10 text-center text-theme-muted text-sm">No redemptions found. Time to earn some tokens!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default StudentVault;
