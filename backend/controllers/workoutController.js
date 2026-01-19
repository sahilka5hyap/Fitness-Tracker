const asyncHandler = require('express-async-handler');
const Workout = require('../models/Workout');

// Get Workouts
const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(workouts);
});

// Log Workout
const setWorkout = asyncHandler(async (req, res) => {
  const { title, exerciseName, muscleGroup, sets, reps, weight, duration, caloriesBurned, distance, date } = req.body;

  const workout = await Workout.create({
    user: req.user.id,
    title: title || exerciseName,
    exerciseName, muscleGroup, sets, reps, weight, duration, caloriesBurned, distance,
    date: date || new Date()
  });

  res.status(200).json(workout);
});

module.exports = { getWorkouts, setWorkout };