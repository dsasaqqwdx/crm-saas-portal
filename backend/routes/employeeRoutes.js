const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addEmployee, markAttendance } = require('../controllers/hrController');

// @route   POST /api/employees/add
// @desc    Add a new employee (Private)
router.post('/add', auth, addEmployee);

// @route   POST /api/employees/attendance
// @desc    Mark daily attendance (Private)
router.post('/attendance', auth, markAttendance);

module.exports = router;