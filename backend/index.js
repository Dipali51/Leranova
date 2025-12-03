require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./Connection/db");
const User = require('./models/User');
// ensure question model is registered
require('./models/question');
const bcrypt = require('bcryptjs');

const userRoutes = require("./routes/userroutes");
const courseRoutes = require("./routes/courseroutes");

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();

// Seed default admin user
const seedAdmin = async () => {
  try {
    const adminEmail = 'Admin@123.gmail.com';
    const adminPassword = 'Admin@123';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        username: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created: Admin@123.gmail.com / Admin@123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

seedAdmin();

app.use("/api", userRoutes);
app.use("/api", courseRoutes);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  // Development convenience: log presence of Razorpay keys (do NOT print the secret)
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    console.log('ℹ️ Razorpay keys are configured (key id present).');
  } else {
    console.log('⚠️ Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Either stop the process using that port or set the PORT environment variable to a different port before starting the server.`);
    console.error(`Suggested commands (PowerShell):`);
    console.error(`  Get-NetTCPConnection -LocalPort ${PORT} | Select-Object OwningProcess`);
    console.error(`  Stop-Process -Id <PID> -Force`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
