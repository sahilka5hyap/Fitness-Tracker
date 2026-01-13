const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number, // in cm
  fitnessGoal: String, // e.g., "General Health", "Muscle Gain"
  achievements: [String] // Array of strings for badges
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);