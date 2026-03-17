const express = require('express');
const router = express.Router();
const { getSummary, getActivities } = require('./dashboardController');
const protect = require('../../middleware/authMiddleware');

router.get('/summary', protect, getSummary);
router.get('/activities', protect, getActivities);

module.exports = router;