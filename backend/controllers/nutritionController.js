const asyncHandler = require('express-async-handler');
const Meal = require('../models/Meal');

// Get Meals
const getMeals = asyncHandler(async (req, res) => {
  const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(meals);
});

// Log Meal
const setMeal = asyncHandler(async (req, res) => {
  const { mealType, foodName, calories, protein, carbs, fat, date } = req.body;

  const meal = await Meal.create({
    user: req.user.id,
    mealType, foodName, calories, protein, carbs, fat,
    date: date || new Date()
  });

  res.status(200).json(meal);
});

module.exports = { getMeals, setMeal };