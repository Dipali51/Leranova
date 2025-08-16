const express = require('express');
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAllUsers 
} = require('../controller/usercontroller');

const router = express.Router();

// Signup (role can be "student" or "teacher")
router.post('/signup', registerUser);

// Login
router.post('/login', loginUser);

// Forget password
router.post('/forget-password', forgetPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
