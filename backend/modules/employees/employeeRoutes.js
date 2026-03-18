const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const {
    addEmployee,
    getEmployees,
    getEmployeeProfile
} = require('./employeeController');

router.post('/add', auth, roleCheck(['company_admin', 'super_admin']), addEmployee);
router.get('/', auth, roleCheck(['company_admin', 'super_admin']), getEmployees);
router.get('/profile', auth, getEmployeeProfile);

module.exports = router;