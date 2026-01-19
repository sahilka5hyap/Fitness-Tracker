const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

router.get('/profile', protect, getMe);

router.put('/profile', protect, updateProfile);

module.exports = router;