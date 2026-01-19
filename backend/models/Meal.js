const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: Date, default: Date.now },
  
  mealType: { type: String, required: true }, 
  foodName: { type: String, required: true },

  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);