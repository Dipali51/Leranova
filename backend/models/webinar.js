const mongoose = require('mongoose');

const WebinarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Webinar', WebinarSchema);