const express = require('express');
const router = express.Router();
// Controller import kar rahe hain (agar file create ki hai step 4 mein)
const { getStats, setStat } = require('../controllers/bodyStatsController'); 
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStats).post(protect, setStat);

module.exports = router;