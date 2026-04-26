const pool = require('../config/db');

const getBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT balance, updated_at FROM token_wallet WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found for this user' });
    }

    return res.status(200).json({
      user_id: userId,
      balance: result.rows[0].balance,
      updated_at: result.rows[0].updated_at,
    });
  } catch (err) {
    console.error('Get balance error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const redeemTokens = async (req, res) => {
  const userId = req.user.id;
  const { tokens_to_use, reward_type } = req.body;

  const allowedRewards = ['Certificate', 'Priority Seating', 'Exam Fee Waiver'];

  if (!tokens_to_use || !reward_type) {
    return res.status(400).json({ error: 'tokens_to_use and reward_type are required' });
  }

  if (!allowedRewards.includes(reward_type)) {
    return res.status(400).json({
      error: `Invalid reward_type. Must be one of: ${allowedRewards.join(', ')}`,
    });
  }

  const tokensInt = parseInt(tokens_to_use, 10);
  if (isNaN(tokensInt) || tokensInt <= 0) {
    return res.status(400).json({ error: 'tokens_to_use must be a positive integer' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch current balance with lock
    const walletResult = await client.query(
      `SELECT balance FROM token_wallet WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    if (walletResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const currentBalance = walletResult.rows[0].balance;

    if (currentBalance < tokensInt) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Insufficient balance. Current balance: ${currentBalance}, tokens requested: ${tokensInt}`,
      });
    }

    // Deduct tokens from wallet
    await client.query(
      `UPDATE token_wallet
       SET balance = balance - $1, updated_at = NOW()
       WHERE user_id = $2`,
      [tokensInt, userId]
    );

    // Insert redemption record
    const redemptionResult = await client.query(
      `INSERT INTO redemptions (user_id, tokens_used, reward_type)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, tokens_used, reward_type, redeemed_at`,
      [userId, tokensInt, reward_type]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Tokens redeemed successfully',
      redemption: redemptionResult.rows[0],
      new_balance: currentBalance - tokensInt,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Redeem error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getRedemptionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, user_id, tokens_used, reward_type, redeemed_at
       FROM redemptions
       WHERE user_id = $1
       ORDER BY redeemed_at DESC`,
      [userId]
    );

    return res.status(200).json({
      user_id: userId,
      total_redemptions: result.rows.length,
      history: result.rows,
    });
  } catch (err) {
    console.error('Redemption history error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getBalance, redeemTokens, getRedemptionHistory };
