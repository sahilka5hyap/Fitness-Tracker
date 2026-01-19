const express = require('express');
const router = express.Router();
const { getWorkouts, setWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWorkouts).post(protect, setWorkout);

module.exports = router;