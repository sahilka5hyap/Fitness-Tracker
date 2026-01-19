const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: [true, 'Please add a workout title'] }, 
  
  // Exercise Details
  exerciseName: { type: String }, 
  muscleGroup: { type: String }, // Chest, Legs, etc.
  
  // Strength Data
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number }, // kg
  
  // Cardio Data
  duration: { type: Number }, // minutes
  caloriesBurned: { type: Number },
  distance: { type: Number }, // km
  
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);