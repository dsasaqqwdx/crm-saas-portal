const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addEmployee, markAttendance } = require('../controllers/hrController');

// @route   POST /api/employees/add
// @desc    Add a new employee to the user's company
router.post('/add', auth, addEmployee);

// @route   POST /api/employees/attendance
// @desc    Mark daily attendance
router.post('/attendance', auth, markAttendance);

/** * PRO TIP: Added a placeholder for getting employees 
 * router.get('/', auth, getEmployees); 
 */

module.exports = router;