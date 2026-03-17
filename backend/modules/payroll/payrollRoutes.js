const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');

// 1. Import all functions from the controller
const {
    getPayrollList,
    processPayment,
    downloadPayslip
} = require('./payrollController');

// 2. Define the Routes
// GET /api/payroll
router.get('/', auth, roleCheck(['company_admin', 'super_admin']), getPayrollList);

// POST /api/payroll/generate
router.post('/generate', auth, roleCheck(['company_admin', 'super_admin']), processPayment);

// GET /api/payroll/download/:id
// Note: We use 'downloadPayslip' directly here since we destructured it above
router.get('/download/:id', auth, roleCheck(['company_admin', 'super_admin']), downloadPayslip);

module.exports = router;