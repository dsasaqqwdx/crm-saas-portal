const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { createCompany, getCompanies, getGlobalSummary } = require('./saasController');

// @route   POST /api/saas/create
// @desc    Create a new company
router.post('/create', auth, roleCheck(['super_admin', 'software_owner']), createCompany);

// @route   GET /api/saas/companies
// @desc    Get all companies
router.get('/companies', auth, roleCheck(['super_admin', 'software_owner']), getCompanies);

// @route   GET /api/saas/global-summary
// @desc    Get global stats for superadmin
router.get('/global-summary', auth, roleCheck(['super_admin', 'software_owner']), getGlobalSummary);

module.exports = router;
