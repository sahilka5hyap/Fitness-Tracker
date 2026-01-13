const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true }, // e.g., "Morning Run"
  type: { type: String, required: true }, // "Strength", "Cardio"
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: Number,
  notes: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);