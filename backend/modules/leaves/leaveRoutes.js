const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { applyLeave, getLeaves, approveLeave } = require('./leaveController');

// @route   GET /api/leaves
router.get('/', auth, roleCheck(['company_admin', 'super_admin', 'employee']), getLeaves);

// @route   POST /api/leaves/apply
router.post('/apply', auth, roleCheck(['employee', 'company_admin', 'super_admin']), applyLeave);

// @route   PUT /api/leaves/approve/:id
router.put('/approve/:id', auth, roleCheck(['company_admin', 'super_admin']), approveLeave);

module.exports = router;
