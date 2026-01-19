const express = require('express');
const router = express.Router();
const { getMeals, setMeal } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMeals).post(protect, setMeal);

module.exports = router;