const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
  res.json(meals);
});

router.post('/', protect, async (req, res) => {
  const meal = await Meal.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(meal);
});

module.exports = router;