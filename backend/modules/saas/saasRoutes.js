const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { createCompany, getCompanies, getGlobalSummary, getAllUsers } = require('./saasController');

router.post('/create', auth, roleCheck(['super_admin', 'software_owner']), createCompany);

router.get('/companies', auth, roleCheck(['super_admin', 'software_owner']), getCompanies);
router.get('/global-summary', auth, roleCheck(['super_admin', 'software_owner']), getGlobalSummary);
router.get('/users', auth, roleCheck(['super_admin', 'software_owner']), getAllUsers);

module.exports = router;
