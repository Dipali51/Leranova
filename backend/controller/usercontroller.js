const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Webinar = require('../models/webinar');
const Package = require('../models/package');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Verification = require('../models/verification');


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

        // Registration now requires prior verification record
        const verification = await Verification.findOne({ email });
        if (!verification) {
            return res.status(400).json({ error: 'No verification found for this email. Request verification first.' });
        }

        // Make sure the verification hasn't expired
        if (verification.expiresAt < Date.now()) {
            await Verification.deleteOne({ email });
            return res.status(400).json({ error: 'Verification expired. Request a new code.' });
        }

        // Hash the password stored in verification (we stored passwordHash already)
        const newUser = new User({
            username,   // 👈 match schema
            email,
            password: verification.passwordHash,
            role: role || "student",
        });

        await newUser.save();
        // remove verification record
        await Verification.deleteOne({ email });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("❌ Error in registration:", error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Request verification code (step 1)
exports.requestVerification = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        // generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const passwordHash = await bcrypt.hash(password, 10);

        // upsert verification
        await Verification.findOneAndUpdate({ email }, { username, email, passwordHash, role: role || 'student', code, expiresAt }, { upsert: true, new: true });

        // If SMTP is not configured (no explicit host+port and no service) OR we're running outside production,
        // fall back to dev behaviour (log and return code). If EMAIL_HOST+EMAIL_PORT or EMAIL_SERVICE are present,
        // we'll attempt to send.
        const hasExplicitSmtp = process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
        const hasServiceSmtp = process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
        if (!(hasExplicitSmtp || hasServiceSmtp) || process.env.NODE_ENV !== 'production') {
            // Dev-friendly: log the code and return it in the response so local testing doesn't require SMTP
            console.warn('⚠️ Email not configured or running in non-production mode. Logging verification code to console (dev mode).');
            console.log(`Verification code for ${email}: ${code}`);
            return res.status(200).json({ message: 'Verification code generated (dev mode)', code });
        }

        // send email via configured SMTP. Support explicit host/port (EMAIL_HOST/EMAIL_PORT) or nodemailer 'service'.
        let transporter;
        if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_SECURE === 'true', // true for port 465
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
            });
        } else {
            transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'Your verification code',
            text: `Your verification code is: ${code}. It expires in 15 minutes.`
        };

        try {
            // verify SMTP connection before sending (helps debug auth/connectivity issues)
            await transporter.verify();
        } catch (verifyErr) {
            console.error('SMTP verify failed:', verifyErr);
            // continue to attempt sending; sendMail will likely fail but we'll capture its error
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending verification email', err);
                // Fallback: log the code and include it and the error message in the response for debugging
                console.warn('Falling back to logging the code to console due to send error');
                console.log(`Verification code for ${email}: ${code}`);
                return res.status(200).json({ message: 'Verification code generated (logged to server console) - email send failed', code, error: err.message });
            }
            console.log('Verification email sent:', info && info.response ? info.response : info);
            return res.status(200).json({ message: 'Verification code sent' });
        });
    } catch (error) {
        console.error('Error requesting verification:', error);
        res.status(500).json({ error: 'Error requesting verification' });
    }
};

// Confirm verification and create user (step 2)
exports.confirmVerification = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    try {
        const verification = await Verification.findOne({ email });
        if (!verification) return res.status(400).json({ error: 'No verification found' });
        if (verification.expiresAt < Date.now()) {
            await Verification.deleteOne({ email });
            return res.status(400).json({ error: 'Verification expired' });
        }
        if (verification.code !== code) return res.status(400).json({ error: 'Invalid code' });

        // ensure username/email not taken (could happen if another registration completed)
        const existingByEmail = await User.findOne({ email: verification.email });
        if (existingByEmail) {
            await Verification.deleteOne({ email });
            return res.status(400).json({ error: 'Email already registered' });
        }
        const existingByUsername = await User.findOne({ username: verification.username });
        if (existingByUsername) {
            // if username already exists, append a suffix to make it unique or return error
            // here we'll return an error so the client can pick a different username
            await Verification.deleteOne({ email });
            return res.status(400).json({ error: 'Username already taken' });
        }

        // create user using the stored hashed password
        const newUser = new User({ username: verification.username, email: verification.email, password: verification.passwordHash, role: verification.role });
        await newUser.save();
        await Verification.deleteOne({ email });
        res.status(201).json({ message: 'User verified and created', user: newUser });
    } catch (error) {
        console.error('Error confirming verification:', error);
        // include the error message to help debug from frontend (but avoid exposing stacks in production)
        res.status(500).json({ error: 'Error confirming verification', message: error.message });
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


        // support explicit SMTP host/port for reset emails as well
        let transporter;
        if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
            });
        } else {
            transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }


        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
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

// Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            token,
            role: user.role,
            name: user.username,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in admin' });
    }
};

// Get all users grouped by role
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username email role _id');
        const teachersRaw = users.filter(u => u.role === 'teacher');
        const studentsRaw = users.filter(u => u.role === 'student');
        const admins = users.filter(u => u.role === 'admin');

        // For teachers, add courseCount, enrollmentCount, webinarCount, packageCount
        const teachers = await Promise.all(teachersRaw.map(async (teacher) => {
            const courseCount = await Course.countDocuments({ createdBy: teacher._id });
            const courses = await Course.find({ createdBy: teacher._id }, '_id');
            const courseIds = courses.map(c => c._id);
            const enrollmentCount = await Enrollment.countDocuments({ course: { $in: courseIds } });
            const webinarCount = await Webinar.countDocuments({ createdBy: teacher._id });
            const packageCount = await Package.countDocuments({ createdBy: teacher._id });
            console.log(`Teacher ${teacher.email}: courses ${courseCount}, webinars ${webinarCount}, packages ${packageCount}, enrollments ${enrollmentCount}`);
            return { ...teacher.toObject(), courseCount, enrollmentCount, webinarCount, packageCount };
        }));

        // For students, add enrolledCoursesCount
        const students = await Promise.all(studentsRaw.map(async (student) => {
            const enrolledCoursesCount = await Enrollment.countDocuments({ student: student._id });
            return { ...student.toObject(), enrolledCoursesCount };
        }));

        const grouped = {
            teachers,
            students,
            admins
        };
        res.status(200).json(grouped);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};