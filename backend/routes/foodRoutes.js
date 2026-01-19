const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const initialFoods = require('../data/foodData');

// Search Food
router.get('/search', async (req, res) => {
  const query = req.query.query;
  let foods;
  if (!query) {
    foods = await Food.find({}).limit(10);
  } else {
    foods = await Food.find({ name: { $regex: query, $options: 'i' } }).limit(10);
  }
  res.json(foods);
});

// Seed DB
router.post('/seed', async (req, res) => {
  await Food.deleteMany({});
  await Food.insertMany(initialFoods);
  res.json({ message: 'Food DB seeded!' });
});

module.exports = router;