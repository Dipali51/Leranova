const Courses = require("../models/course");
const path = require("path");


// CREATE a new course
exports.createCourse = async (req, res) => {
  try {
    console.log("📥 Incoming Course Data:", req.body);

    // ✅ Handle cover image upload
    let coverPath = "";
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      console.log("📸 Uploaded Cover Image:", req.files.coverImage[0].filename);
      coverPath = "/uploads/images/" + req.files.coverImage[0].filename;
    }

    const newCourse = new Courses({
      title: req.body.title,
      description: req.body.description,
      pricingPlan: req.body.pricingPlan,
      totalPrice: req.body.totalPrice,
      discountedPrice: req.body.discountedPrice,
      coverImage: coverPath,
      pdfs: [],
      createdBy: req.user.id, // Initialize with empty array
    });

    // ✅ Save to MongoDB
    const savedCourse = await newCourse.save();
    console.log("✅ Course saved:", savedCourse);
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("❌ Error in createCourse:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find({ createdBy: req.user.id });
    res.status(200).json(courses);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error("❌ Error fetching course by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      title,
      description,
      pricingPlan,
      totalPrice,
      discountedPrice,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Handle new cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      // Optional: delete old image file if needed
      if (course.coverImage) {
        const oldPath = path.join(__dirname, "..", "uploads", "images", path.basename(course.coverImage));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      course.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.pricingPlan = pricingPlan || course.pricingPlan;
    course.totalPrice = pricingPlan === "one-time" ? totalPrice : 0;
    course.discountedPrice = pricingPlan === "one-time" ? discountedPrice : 0;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// ✅ Upload and link PDF to course
exports.uploadPdfToCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!req.file || !courseId) {
      return res.status(400).json({ error: "Missing PDF file or courseId" });
    }
    bchvbcxhvch
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const pdfPath = "/uploads/pdfs/" + req.file.filename;


    course.pdfs.push({ filePath: pdfPath });
    await course.save();

    res.status(200).json({
      message: "✅ PDF uploaded and attached to course",
      pdfPath: pdfPath,
      filePath: pdfPath,
      course,
    });
  } catch (err) {
    console.error("❌ Error uploading PDF:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
