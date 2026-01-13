const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true }, // e.g. "Lose 5kg"
  type: String, // "Weight Goal"
  targetValue: Number,
  unit: String, // "kg"
  currentProgress: { type: Number, default: 0 },
  deadline: Date,
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);