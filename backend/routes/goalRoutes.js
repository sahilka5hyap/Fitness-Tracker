const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.json(goals);
});

router.post('/', protect, async (req, res) => {
  const goal = await Goal.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(goal);
});

// Update progress (e.g., adding steps to a goal)
router.put('/:id', protect, async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (goal && goal.user.toString() === req.user.id.toString()) {
    goal.currentProgress = req.body.currentProgress || goal.currentProgress;
    if (goal.currentProgress >= goal.targetValue) goal.status = 'completed';
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } else {
    res.status(404).json({ message: 'Goal not found' });
  }
});

module.exports = router;