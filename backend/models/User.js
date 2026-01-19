const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Data
  age: { type: Number },
  height: { type: Number }, // cm
  weight: { type: Number }, // Current Weight (kg)
  gender: { type: String },
  fitnessGoal: { type: String, default: 'General Health' },
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);