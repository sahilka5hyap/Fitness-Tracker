const mongoose = require('mongoose');

const bodyStatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  waist: Number,
  chest: Number,
  arms: Number,
  heartRate: Number,
  steps: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BodyStat', bodyStatSchema);