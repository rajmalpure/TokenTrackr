const pool = require('../config/db');

const markAttendance = async (req, res) => {
  console.log(`Attendance Mark Attempt - User ID: ${req.user.id}, Role: ${req.user.role}`);
  const userRole = req.user.role?.toLowerCase().trim();
  if (userRole !== 'admin') {
    return res.status(403).json({ error: `Forbidden: admin access required.` });
  }

  const { user_id, date } = req.body;
  if (!user_id || !date) {
    return res.status(400).json({ error: 'user_id and date are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const attendanceResult = await client.query(
      `INSERT INTO attendance (user_id, date, status, tokens_awarded)
       VALUES ($1, $2, 'present', 10)
       RETURNING id, user_id, date, status, tokens_awarded, created_at`,
      [user_id, date]
    );
    await client.query(
      `UPDATE token_wallet SET balance = balance + 10, updated_at = NOW() WHERE user_id = $1`,
      [user_id]
    );
    await client.query('COMMIT');
    return res.status(201).json({
      message: 'Attendance marked and tokens awarded',
      attendance: attendanceResult.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ error: 'Already marked for this date' });
    console.error('Mark attendance error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getAttendanceByUser = async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, date, status, tokens_awarded, created_at
       FROM attendance WHERE user_id = $1 ORDER BY date DESC`,
      [userId]
    );

    // 🔥 STREAK CALCULATION
    let streak = 0;
    if (result.rows.length > 0) {
      const dates = result.rows.map(r => new Date(r.date).toISOString().split('T')[0]);
      let current = new Date();
      // Check if they were present today or yesterday to continue streak
      let checkDate = current.toISOString().split('T')[0];
      
      // If not present today, check if present yesterday
      if (!dates.includes(checkDate)) {
        current.setDate(current.getDate() - 1);
        checkDate = current.toISOString().split('T')[0];
      }

      while (dates.includes(checkDate)) {
        streak++;
        current.setDate(current.getDate() - 1);
        checkDate = current.toISOString().split('T')[0];
      }
    }

    return res.status(200).json({
      total_count: result.rows.length,
      streak: streak,
      attendance: result.rows,
    });
  } catch (err) {
    console.error('Get attendance error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { markAttendance, getAttendanceByUser };
