const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Asset", assetSchema);
