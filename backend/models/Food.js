const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  servingSize: { type: String, default: '1 serving' },
  
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  
  category: { type: String } 
});

module.exports = mongoose.model('Food', foodSchema);