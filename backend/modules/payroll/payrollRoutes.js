const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');

const {
    getPayrollList,
    processPayment,
    downloadPayslip
} = require('./payrollController');

router.get('/', auth, roleCheck(['company_admin', 'super_admin']), getPayrollList);
router.post('/generate', auth, roleCheck(['company_admin', 'super_admin']), processPayment);
router.get('/download/:id', auth, roleCheck(['company_admin', 'super_admin']), downloadPayslip);

module.exports = router;