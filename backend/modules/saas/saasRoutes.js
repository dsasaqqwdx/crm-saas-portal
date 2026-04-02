
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const { 
    createCompany, 
    getCompanies, 
    getGlobalSummary, 
    getAllUsers, 
    deleteCompany 
} = require('./saasController');

const adminRoles = roleCheck(['super_admin', 'software_owner']);

router.post('/create', auth, adminRoles, createCompany);

router.get('/companies', auth, adminRoles, getCompanies);
router.get('/global-summary', auth, adminRoles, getGlobalSummary);


router.delete('/company/:id', auth, adminRoles, deleteCompany);

module.exports = router;