const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const {
    addEmployee,
    getEmployees,
    getEmployeeProfile
} = require('./employeeController');

// @route   POST /api/employees/add
// @desc    Add a new employee (Admin/Superadmin only)
router.post('/add', auth, roleCheck(['company_admin', 'super_admin']), addEmployee);

// @route   GET /api/employees/
// @desc    Get all employees for the company
router.get('/', auth, roleCheck(['company_admin', 'super_admin']), getEmployees);

// @route   GET /api/employees/profile
// @desc    Get the logged-in employee's specific profile
router.get('/profile', auth, getEmployeeProfile);

module.exports = router;