// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔧 Ensure directory exists before storing files
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 📦 Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/misc";

    // Route based on MIME type
    if (file.mimetype.startsWith("image/")) folder = "uploads/images";
    else if (file.mimetype === "application/pdf") folder = "uploads/pdfs";

    const fullPath = path.join(__dirname, "..", folder);
    ensureDirExists(fullPath); // 🛡️ Auto-create if not exists
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// ✅ Optional file filter
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/quicktime",
    "video/mpeg",
    "video/x-msvideo",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

// Export configured Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
