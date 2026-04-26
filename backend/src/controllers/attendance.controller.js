const pool = require('../config/db');

const markAttendance = async (req, res) => {
  // Debug log to see what role is being received
  console.log(`Attendance Mark Attempt - User ID: ${req.user.id}, Role: ${req.user.role}`);

  // Admin-only check (case-insensitive and trimmed)
  const userRole = req.user.role?.toLowerCase().trim();
  if (userRole !== 'admin') {
    return res.status(403).json({ error: `Forbidden: admin access required. Your role is: ${req.user.role}` });
  }

  const { user_id, date } = req.body;

  if (!user_id || !date) {
    return res.status(400).json({ error: 'user_id and date are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert attendance record
    const attendanceResult = await client.query(
      `INSERT INTO attendance (user_id, date, status, tokens_awarded)
       VALUES ($1, $2, 'present', 10)
       RETURNING id, user_id, date, status, tokens_awarded, created_at`,
      [user_id, date]
    );

    // Update token wallet balance by adding 10
    await client.query(
      `UPDATE token_wallet
       SET balance = balance + 10, updated_at = NOW()
       WHERE user_id = $1`,
      [user_id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Attendance marked and tokens awarded',
      attendance: attendanceResult.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Attendance already marked for this user on this date' });
    }
    if (err.code === '23503') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Mark attendance error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getAttendanceByUser = async (req, res) => {
  const { userId } = req.params;

  // Allow admins to view any user; students can only view their own
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden: you can only view your own attendance' });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, date, status, tokens_awarded, created_at
       FROM attendance
       WHERE user_id = $1
       ORDER BY date DESC`,
      [userId]
    );

    return res.status(200).json({
      total_count: result.rows.length,
      attendance: result.rows,
    });
  } catch (err) {
    console.error('Get attendance error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { markAttendance, getAttendanceByUser };
