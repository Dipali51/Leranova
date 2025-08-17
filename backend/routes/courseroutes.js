const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const courseController = require("../controller/courseController");
const Course = require("../models/course"); // ⬅️ Import Course model
const auth = require("../middleware/auth");

// ✅ Upload Cover Image
router.post("/upload-cover", upload.single("coverImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Cover image is missing" });
  }

  console.log("✅ Uploaded cover image:", req.file.filename);
  res.status(200).json({
    message: "Cover image uploaded successfully",
    filePath: `/uploads/images/${req.file.filename}`,
  });
});

// ✅ Upload PDF (generic - optional route, can keep or remove)
router.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "PDF file is missing" });
  }

  console.log("✅ Uploaded PDF file:", req.file.filename);
  res.status(200).json({
    message: "PDF uploaded successfully",
    filePath: `/uploads/pdfs/${req.file.filename}`,
  });
});

// ✅ Upload PDF to a specific course by ID
router.post("/course/:id/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is missing" });
    }

    const pdfPath = `/uploads/pdfs/${req.file.filename}`;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { pdfs: { title: req.file.originalname, url: pdfPath } } },
      { new: true }
    );

    res.status(200).json({
      message: "PDF uploaded and saved to course",
      updatedCourse,
    });
  } catch (error) {
    console.error("❌ Error uploading PDF to course:", error);
    res.status(500).json({ error: "Failed to upload PDF to course" });
  }
});

router.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/course/:id", upload.fields([
  { name: "coverImage", maxCount: 1 },
]), courseController.updateCourse);

// ✅ Create course (merged route for coverImage and PDFfile)
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "PDFfile", maxCount: 1 },
  ]),
  courseController.createCourse
);

// ✅ Get all courses
router.get("/courses", auth, courseController.getAllCourses);

module.exports = router;
