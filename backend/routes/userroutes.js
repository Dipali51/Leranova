const express = require('express');
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAllUsers 
} = require('../controller/usercontroller');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
module.exports = router;
