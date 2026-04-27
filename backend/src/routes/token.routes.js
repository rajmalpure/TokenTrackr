const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  getBalance, 
  redeemTokens, 
  getRedemptionHistory, 
  getTreasuryStats, 
  getLeaderboard 
} = require('../controllers/token.controller');

// PUBLIC/AUTH: Leaderboard
router.get('/leaderboard', authMiddleware, getLeaderboard);

// USER: Balance & Redemption
router.get('/balance', authMiddleware, getBalance);
router.post('/redeem', authMiddleware, redeemTokens);
router.get('/history', authMiddleware, getRedemptionHistory);

// ADMIN ONLY: Treasury
router.get('/treasury', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}, getTreasuryStats);

module.exports = router;
