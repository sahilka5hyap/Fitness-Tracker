const asyncHandler = require('express-async-handler');
const BodyStat = require('../models/BodyStat');

// Get Stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await BodyStat.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(stats);
});

// Log Stats
const setStat = asyncHandler(async (req, res) => {
  const { weight, bodyFat, muscleMass, steps, sleep, water, waist, chest, arms, legs, notes, date } = req.body;

  const stat = await BodyStat.create({
    user: req.user.id,
    date: date || new Date(),
    weight, bodyFat, muscleMass, steps, sleep, water, waist, chest, arms, legs, notes
  });

  res.status(200).json(stat);
});

module.exports = { getStats, setStat };