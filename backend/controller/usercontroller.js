const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');


// User Registration
exports.registerUser = async (req, res) => {
    console.log("Registering:", req.body);
    const { username, email, password, role } = req.body;  // 👈 use username
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,   // 👈 match schema
            email,
            password: hashedPassword,
            role: role || "student",
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("❌ Error in registration:", error);
        res.status(500).json({ error: 'Error registering user' });
    }
};



// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },  // 👈 store role in token
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            role: user.role,   // 👈 send role to frontend
            name: user.name,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};




// Forget Password
exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;  
        await user.save();

        
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,  
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASSWORD    
            }
        });

        
        const mailOptions = {
            from: process.env.EMAIL_USER,  
            to: email,
            subject: 'Password Reset Request',
            text: `To reset your password, click the following link or paste it into your browser:\n\nhttp://localhost:3001/api/users/reset-password?token=${resetToken}\n\nIf you did not request a password reset, please ignore this email.`
        };

        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email' });
                
            }
            res.status(200).json({ message: 'Reset password link sent to email' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error handling forgot password request' });
    }
};


// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }  
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;  
        user.resetTokenExpiry = undefined;  
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password' });
    }
};