const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'], // 👈 added student & teacher
    default: 'student' // 👈 by default, users are students
  }
  ,
  // Simple wallet balance for teachers to receive payments
  balance: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
