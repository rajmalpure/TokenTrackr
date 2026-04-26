import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const REWARD_OPTIONS = ['Certificate', 'Priority Seating', 'Exam Fee Waiver'];

const TokenWallet = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemForm, setRedeemForm] = useState({ tokens_to_use: '', reward_type: 'Certificate' });
  const [redeemMessage, setRedeemMessage] = useState({ text: '', type: '' });
  const [redeemLoading, setRedeemLoading] = useState(false);

  const fetchWalletData = async () => {
    try {
      const [balanceRes, historyRes] = await Promise.all([
        api.get('/tokens/balance'),
        api.get('/tokens/history'),
      ]);
      setBalance(balanceRes.data.balance);
      setHistory(historyRes.data.history);
    } catch (err) {
      console.error('Failed to load wallet data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleRedeemChange = (e) => {
    setRedeemForm({ ...redeemForm, [e.target.name]: e.target.value });
    setRedeemMessage({ text: '', type: '' });
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemLoading(true);
    setRedeemMessage({ text: '', type: '' });

    try {
      const response = await api.post('/tokens/redeem', {
        tokens_to_use: parseInt(redeemForm.tokens_to_use, 10),
        reward_type: redeemForm.reward_type,
      });
      setBalance(response.data.new_balance);
      setRedeemMessage({
        text: `✅ Successfully redeemed ${redeemForm.tokens_to_use} tokens for "${redeemForm.reward_type}"!`,
        type: 'success',
      });
      setRedeemForm({ tokens_to_use: '', reward_type: 'Certificate' });
      // Refresh history
      const historyRes = await api.get('/tokens/history');
      setHistory(historyRes.data.history);
    } catch (err) {
      setRedeemMessage({
        text: `❌ ${err.response?.data?.error || 'Redemption failed'}`,
        type: 'error',
      });
    } finally {
      setRedeemLoading(false);
    }
  };

  const formatDateTime = (dtStr) => {
    return new Date(dtStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case 'Certificate': return '🏆';
      case 'Priority Seating': return '🪑';
      case 'Exam Fee Waiver': return '💸';
      default: return '🎁';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Token Wallet 💰</h1>
          <p className="text-slate-400 mt-1">Manage and redeem your earned tokens</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <>
            {/* Balance Hero */}
            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 mb-8 shadow-xl">
              <p className="text-slate-300 text-sm font-medium uppercase tracking-widest mb-1">Current Balance</p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-white">{balance}</span>
                <span className="text-2xl text-purple-400 mb-2">tokens</span>
              </div>
              <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((balance / 200) * 100, 100)}%` }}
                />
              </div>
              <p className="text-slate-500 text-xs mt-1">{balance}/200 tokens to max milestone</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Redeem Form */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Redeem Tokens
                </h2>

                <form onSubmit={handleRedeem} className="space-y-5">
                  {redeemMessage.text && (
                    <div
                      className={`rounded-lg px-4 py-3 text-sm border ${
                        redeemMessage.type === 'success'
                          ? 'bg-green-500/20 border-green-500/50 text-green-300'
                          : 'bg-red-500/20 border-red-500/50 text-red-300'
                      }`}
                    >
                      {redeemMessage.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tokens to Use</label>
                    <input
                      id="redeem-tokens"
                      type="number"
                      name="tokens_to_use"
                      value={redeemForm.tokens_to_use}
                      onChange={handleRedeemChange}
                      required
                      min="1"
                      max={balance}
                      placeholder={`1 - ${balance}`}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <p className="text-slate-500 text-xs mt-1">Available: {balance} tokens</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Reward Type</label>
                    <select
                      id="redeem-reward-type"
                      name="reward_type"
                      value={redeemForm.reward_type}
                      onChange={handleRedeemChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      {REWARD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {getRewardIcon(opt)} {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="redeem-submit"
                    type="submit"
                    disabled={redeemLoading || balance === 0}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    {redeemLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Redeem Now'
                    )}
                  </button>
                </form>

                {/* Reward Info */}
                <div className="mt-6 space-y-2">
                  {REWARD_OPTIONS.map((opt) => (
                    <div key={opt} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <span className="text-lg">{getRewardIcon(opt)}</span>
                      <span className="text-slate-300 text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redemption History */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Redemption History</h2>
                  <p className="text-slate-400 text-sm">{history.length} total redemptions</p>
                </div>

                {history.length === 0 ? (
                  <div className="px-6 py-12 text-center text-slate-500">
                    <span className="text-4xl">🎁</span>
                    <p className="mt-3">No redemptions yet</p>
                    <p className="text-xs mt-1">Redeem your tokens to see history</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-white/5 transition flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getRewardIcon(item.reward_type)}</span>
                          <div>
                            <p className="text-white text-sm font-medium">{item.reward_type}</p>
                            <p className="text-slate-500 text-xs">{formatDateTime(item.redeemed_at)}</p>
                          </div>
                        </div>
                        <span className="text-red-400 font-semibold text-sm">-{item.tokens_used}</span>
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
