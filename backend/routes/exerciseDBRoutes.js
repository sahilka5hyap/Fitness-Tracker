const express = require('express');
const router = express.Router();
const ExerciseDB = require('../models/ExerciseDB');
const initialExercises = require('../data/exerciseData');

// Search Exercise
router.get('/search', async (req, res) => {
  const query = req.query.query;
  let exercises;
  if (!query) {
    exercises = await ExerciseDB.find({}).limit(10);
  } else {
    exercises = await ExerciseDB.find({ name: { $regex: query, $options: 'i' } }).limit(10);
  }
  res.json(exercises);
});

// Seed DB
router.post('/seed', async (req, res) => {
  await ExerciseDB.deleteMany({});
  await ExerciseDB.insertMany(initialExercises);
  res.json({ message: 'Exercise DB seeded!' });
});

module.exports = router;