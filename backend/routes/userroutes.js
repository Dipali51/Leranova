const express = require('express');
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAllUsers,
  adminLogin
} = require('../controller/usercontroller');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Signup (role can be "student" or "teacher")
router.post('/signup', registerUser);

// Login
router.post('/login', loginUser);

// Admin Login
router.post('/admin/login', adminLogin);

// Forget password
router.post('/forget-password', forgetPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

// Get all users (admin only)
router.get('/admin/users', auth, adminAuth, getAllUsers);

module.exports = router;
