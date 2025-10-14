const express = require('express');
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAllUsers,
  adminLogin
} = require('../controller/usercontroller');
const { requestVerification, confirmVerification } = require('../controller/usercontroller');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Signup (role can be "student" or "teacher")
// Two-step signup: request verification then confirm
router.post('/signup/request-verification', requestVerification);
router.post('/signup/confirm', confirmVerification);
router.post('/signup', registerUser); // kept for compatibility (server-side check)

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
