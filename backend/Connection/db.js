const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://dipalihuetech:Dipali%401311@usk.yilytdm.mongodb.net/Graphy?retryWrites=true&w=majority");
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        // Do not exit the process here so nodemon can report the stacktrace and we can diagnose the issue.
        // Returning false allows the caller to decide how to handle the failure.
        return false;
    }
};

module.exports = connectDB;
