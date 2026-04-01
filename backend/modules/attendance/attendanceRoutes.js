
const express = require('express');
const router = express.Router();
const protect = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const {
  markAttendance,
  getToday,
  getAllAttendance,
  editSession,
  editAttendance,
} = require('./attendanceController');

const isAdmin = roleCheck(['company_admin', 'super_admin', 'software_owner']);
router.post('/mark', protect, markAttendance);
router.get('/today', protect, getToday);
router.get('/all', protect, isAdmin, getAllAttendance);
router.put('/edit', protect, isAdmin, editAttendance);
router.put('/session/edit', protect, isAdmin, editSession);

module.exports = router;