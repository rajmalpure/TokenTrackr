const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getBalance, redeemTokens, getRedemptionHistory } = require('../controllers/token.controller');

// GET /api/tokens/balance - authenticated user
router.get('/balance', authMiddleware, getBalance);

// POST /api/tokens/redeem - authenticated user
router.post('/redeem', authMiddleware, redeemTokens);

// GET /api/tokens/history - authenticated user
router.get('/history', authMiddleware, getRedemptionHistory);

module.exports = router;
