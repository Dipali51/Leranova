const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enrolledAt: { type: Date, default: Date.now },
    source: { type: String, enum: ["link", "purchase", "admin"], default: "link" },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
