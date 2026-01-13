const express = require('express');
const router = express.Router();
const BodyStat = require('../models/BodyStat');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const stats = await BodyStat.find({ user: req.user.id }).sort({ date: -1 });
  res.json(stats);
});

router.post('/', protect, async (req, res) => {
  const stats = await BodyStat.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(stats);
});

module.exports = router;