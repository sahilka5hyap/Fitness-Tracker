const mongoose = require('mongoose');

const bodyStatSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: Date, default: Date.now },
  
  // Biometrics
  weight: { type: Number, required: true },
  bodyFat: { type: Number },
  muscleMass: { type: Number },
  
  // Daily Tracking (New Features)
  steps: { type: Number },
  sleep: { type: Number }, // Hours
  water: { type: Number }, // Liters
  
  // Measurements
  waist: { type: Number },
  chest: { type: Number },
  arms: { type: Number },
  legs: { type: Number },
  
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BodyStat', bodyStatSchema);