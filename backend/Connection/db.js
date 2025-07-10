const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://dipalihuetech:Dipali%401311@usk.yilytdm.mongodb.net/Graphy?retryWrites=true&w=majority");
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
