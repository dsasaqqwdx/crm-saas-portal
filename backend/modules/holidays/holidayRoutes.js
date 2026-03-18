const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { getHolidays, addHoliday } = require('./holidayController');
router.get('/', auth, roleCheck(['company_admin', 'super_admin', 'employee']), getHolidays);

router.post('/add', auth, roleCheck(['company_admin', 'super_admin']), addHoliday);

module.exports = router;
