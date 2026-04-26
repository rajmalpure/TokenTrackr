const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { markAttendance, getAttendanceByUser } = require('../controllers/attendance.controller');

// POST /api/attendance/mark - admin only
router.post('/mark', authMiddleware, markAttendance);

// GET /api/attendance/:userId - authenticated users
router.get('/:userId', authMiddleware, getAttendanceByUser);

module.exports = router;
