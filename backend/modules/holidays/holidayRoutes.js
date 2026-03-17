const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { getHolidays, addHoliday } = require('./holidayController');

// @route   GET /api/holidays
router.get('/', auth, roleCheck(['company_admin', 'super_admin', 'employee']), getHolidays);

// @route   POST /api/holidays/add
router.post('/add', auth, roleCheck(['company_admin', 'super_admin']), addHoliday);

module.exports = router;
