const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Verification', VerificationSchema);
