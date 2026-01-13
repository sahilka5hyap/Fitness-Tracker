const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
  res.json(workouts);
});

router.post('/', protect, async (req, res) => {
  const workout = await Workout.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(workout);
});

module.exports = router;