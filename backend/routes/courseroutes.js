const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const courseController = require("../controller/courseController");
const Course = require("../models/course"); // ⬅️ Import Course model
const auth = require("../middleware/auth");
const assetController = require("../controller/courseController");
const questionController = require('../controller/questionController');

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
  { name: "payoutProof", maxCount: 1 },
]), courseController.updateCourse);

// ✅ Create course (merged route for coverImage and PDFfile)
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "PDFfile", maxCount: 1 },
    { name: "payoutProof", maxCount: 1 },
  ]),
  courseController.createCourse
);

// ✅ Get all courses
router.get("/courses", auth, courseController.getAllCourses);

// Asset routes
router.post("/assets/upload", auth, upload.single("asset"), assetController.uploadAsset);
router.get("/assets", auth, assetController.listAssets);
router.delete("/assets/:id", auth, assetController.deleteAsset);

// Import assets into course
router.post("/course/:id/import-assets", auth, courseController.importAssetsToCourse);

// Question bank routes
router.post('/questions', auth, questionController.createQuestion);
router.get('/questions', auth, questionController.listQuestions);
router.delete('/questions/:id', auth, questionController.deleteQuestion);

// Enroll via link
router.post("/course/:id/enroll", auth, courseController.enrollInCourse);

// Purchase (pay) for a one-time paid course and enroll
router.post("/course/:id/purchase", auth, courseController.purchaseCourse);

// Razorpay: create order
router.post('/course/:id/create-order', auth, courseController.createRazorpayOrder);

// Razorpay: verify payment (client-side callback)
router.post('/course/:id/verify-payment', auth, courseController.verifyRazorpayPayment);

// Razorpay webhook (no auth expected from Razorpay)
router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), courseController.razorpayWebhook);

// List enrollments for current student
router.get("/my-enrollments", auth, courseController.listEnrollmentsForStudent);

// List enrollments for a course (teacher view)
router.get("/course/:id/enrollments", auth, courseController.listEnrollmentsForCourse);

// Publish course
router.post('/course/:id/publish', auth, courseController.publishCourse);

// Upload chapter (video + assignment + notes)
router.post(
  "/course/:id/upload-chapter",
  auth,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'assignment', maxCount: 3 },
    { name: 'notes', maxCount: 3 },
  ]),
  courseController.uploadChapter
);

// Update chapter
router.put(
  "/course/:id/chapter/:chapterId",
  auth,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'assignment', maxCount: 3 },
    { name: 'notes', maxCount: 3 },
  ]),
  courseController.updateChapter
);

// Package Routes
router.post('/packages', auth, courseController.createPackage);
router.get('/packages', auth, courseController.getPackages);
router.put('/packages/:id', auth, courseController.updatePackage);
router.delete('/packages/:id', auth, courseController.deletePackage);

module.exports = router;
