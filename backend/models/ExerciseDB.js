const mongoose = require('mongoose');

const exerciseDBSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  equipment: { type: String, default: 'None' }
});

module.exports = mongoose.model('ExerciseDB', exerciseDBSchema);