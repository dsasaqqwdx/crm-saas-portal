const express = require('express');
const router = express.Router();
const { markAttendance } = require('./attendanceController');
const protect = require('../../middleware/authMiddleware');

// This handles: POST http://localhost:5001/api/attendance/mark
router.post('/mark', protect, markAttendance);

// Health check to verify the route is live
router.get('/test', (req, res) => res.json({ msg: "Attendance system is online" }));

module.exports = router;