const Courses = require("../models/course");
const Asset = require("../models/asset");
const Enrollment = require("../models/enrollment");
const Payment = require('../models/payment');
const User = require('../models/User');
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');


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

    // Collect payout details if provided
    const payoutDetails = {};
    if (req.body.bankName) payoutDetails.bankName = req.body.bankName;
    if (req.body.accountNumber) payoutDetails.accountNumber = req.body.accountNumber;
    if (req.body.ifsc) payoutDetails.ifsc = req.body.ifsc;
    if (req.body.beneficiaryName) payoutDetails.beneficiaryName = req.body.beneficiaryName;

    // handle payoutProof file if uploaded
    if (req.files && req.files.payoutProof && req.files.payoutProof[0]) {
      payoutDetails.payoutProof = `/uploads/misc/${req.files.payoutProof[0].filename}`;
    }

    const newCourse = new Courses({
      title: req.body.title,
      description: req.body.description,
      pricingPlan: req.body.pricingPlan,
      totalPrice: req.body.totalPrice,
      discountedPrice: req.body.discountedPrice,
      coverImage: coverPath,
      instructor: req.body.instructor || undefined,
      payoutDetails: Object.keys(payoutDetails).length ? payoutDetails : undefined,
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
      instructor,
    } = req.body;

    const course = await Courses.findById(courseId);
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
    course.instructor = instructor || course.instructor;
    course.pricingPlan = pricingPlan || course.pricingPlan;
    course.totalPrice = pricingPlan === "one-time" ? totalPrice : 0;
    course.discountedPrice = pricingPlan === "one-time" ? discountedPrice : 0;

    // Update payout details if present in body or files
    if (req.body.bankName) course.payoutDetails = course.payoutDetails || {};
    if (req.body.bankName) course.payoutDetails.bankName = req.body.bankName;
    if (req.body.accountNumber) course.payoutDetails.accountNumber = req.body.accountNumber;
    if (req.body.ifsc) course.payoutDetails.ifsc = req.body.ifsc;
    if (req.body.beneficiaryName) course.payoutDetails.beneficiaryName = req.body.beneficiaryName;
    if (req.files && req.files.payoutProof && req.files.payoutProof[0]) {
      course.payoutDetails = course.payoutDetails || {};
      course.payoutDetails.payoutProof = `/uploads/misc/${req.files.payoutProof[0].filename}`;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Publish a course (only owner or admin)
exports.publishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Owner check: only creator can publish
    if (!req.user || (req.user.id !== course.createdBy.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    course.published = true;
    await course.save();
    res.json({ message: 'Course published', course });
  } catch (err) {
    console.error('Error in publishCourse:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Upload and link PDF to course
exports.uploadPdfToCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!req.file || !courseId) {
      return res.status(400).json({ error: "Missing PDF file or courseId" });
    }
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

// ---------- Asset Library handlers ----------
// Upload a generic asset (image/pdf/file) and save metadata
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File missing" });

    const mime = req.file.mimetype || "";
    let filePath = "/uploads/misc/" + req.file.filename;
    if (mime.startsWith("image/")) filePath = "/uploads/images/" + req.file.filename;
    else if (mime === "application/pdf") filePath = "/uploads/pdfs/" + req.file.filename;

    const asset = new Asset({
      owner: req.user ? req.user.id : null,
      fileName: req.file.originalname,
      filePath,
      mimeType: mime,
      size: req.file.size,
    });

    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    console.error("Error in uploadAsset:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List assets owned by the current user (teacher)
exports.listAssets = async (req, res) => {
  try {
    const ownerId = req.user ? req.user.id : null;
    const query = ownerId ? { owner: ownerId } : {};
    const assets = await Asset.find(query).sort({ uploadedAt: -1 });
    res.json(assets);
  } catch (err) {
    console.error("Error in listAssets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an asset (owner only)
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    if (req.user && asset.owner && asset.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // attempt to delete file from disk (best-effort)
    try {
      const possiblePath = path.join(__dirname, "..", asset.filePath.replace(/^\//, ""));
      if (fs.existsSync(possiblePath)) fs.unlinkSync(possiblePath);
    } catch (e) {
      console.warn("Could not remove asset file:", e.message);
    }

    await asset.remove();
    res.json({ message: "Asset deleted" });
  } catch (err) {
    console.error("Error in deleteAsset:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Import assets into a course (attach as PDFs/files)
exports.importAssetsToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { assetIds } = req.body; // expect array

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      return res.status(400).json({ error: "assetIds array required" });
    }

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const assets = await Asset.find({ _id: { $in: assetIds } });

    assets.forEach((a) => {
      // push into pdfs array for simplicity (keeps existing shape)
      course.pdfs.push({ title: a.fileName, url: a.filePath });
    });

    await course.save();
    res.json({ message: "Imported assets into course", course });
  } catch (err) {
    console.error("Error in importAssetsToCourse:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upload a chapter (video + optional assignment/pdf notes) and attach to course.chapters
exports.uploadChapter = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description } = req.body || {};

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const chapter = { title: title || `Chapter ${(course.chapters || []).length + 1}`, description: description || '' };

    // files: video, assignment, notes
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        chapter.videoUrl = `/uploads/misc/${req.files.video[0].filename}`;
      }

      // assignment(s)
      if (req.files.assignment && req.files.assignment.length > 0) {
        chapter.assignments = req.files.assignment.map(f => ({ title: f.originalname, url: `/uploads/pdfs/${f.filename}` }));
      }
      // notes(s)
      if (req.files.notes && req.files.notes.length > 0) {
        chapter.notes = req.files.notes.map(f => ({ title: f.originalname, url: `/uploads/pdfs/${f.filename}` }));
      }
    }

    course.chapters = course.chapters || [];
    course.chapters.push(chapter);
    await course.save();
    res.json({ message: 'Chapter uploaded', chapter, course });
  } catch (err) {
    console.error('Error in uploadChapter:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an existing chapter by chapter subdocument id
exports.updateChapter = async (req, res) => {
  try {
    const courseId = req.params.id;
    const chapterId = req.params.chapterId;
    const { title, description } = req.body || {};

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const chapter = course.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Update metadata
    if (title !== undefined) chapter.title = title;
    if (description !== undefined) chapter.description = description;

    // Handle uploaded files (replace or append behavior)
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        chapter.videoUrl = `/uploads/misc/${req.files.video[0].filename}`;
      }
      if (req.files.assignment && req.files.assignment.length > 0) {
        chapter.assignments = chapter.assignments || [];
        const newAssign = req.files.assignment.map(f => ({ title: f.originalname, url: `/uploads/pdfs/${f.filename}` }));
        chapter.assignments.push(...newAssign);
      }
      if (req.files.notes && req.files.notes.length > 0) {
        chapter.notes = chapter.notes || [];
        const newNotes = req.files.notes.map(f => ({ title: f.originalname, url: `/uploads/pdfs/${f.filename}` }));
        chapter.notes.push(...newNotes);
      }
    }

    await course.save();
    res.json({ message: 'Chapter updated', chapter, course });
  } catch (err) {
    console.error('Error in updateChapter:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Enroll a student into a course by course link (course id in URL)
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: "Login required" });

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // If course is paid (one-time), require purchase flow instead — prevent free enroll via link
    if (course.pricingPlan === 'one-time') {
      return res.status(402).json({ error: 'Payment required. Use purchase endpoint to enroll.' });
    }

    // simple dedupe check
    const existing = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existing) return res.json({ message: "Already enrolled" });

    const enroll = new Enrollment({ course: courseId, student: studentId, source: "link" });
    await enroll.save();

    res.json({ message: "Enrolled successfully", enroll });
  } catch (err) {
    console.error("Error in enrollInCourse:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Simulated purchase endpoint: records a purchase and enrolls the student
exports.purchaseCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: 'Login required' });

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.pricingPlan !== 'one-time') return res.status(400).json({ error: 'Course is not a paid one-time course' });

    // Ensure teacher has provided payout details so collected payments can be routed
    if (!course.payoutDetails || !course.payoutDetails.accountNumber || !course.payoutDetails.bankName) {
      return res.status(400).json({ error: 'Teacher payout details are missing. Teacher must add bank/payout details to receive payments.' });
    }

    // In a real app, you'd integrate with a payment gateway here. We'll accept a simulated payload.
    const { paymentMethod = 'test', amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Invalid payment amount' });

    // Determine the expected charge amount (discountedPrice preferred)
    const expectedAmount = (course.discountedPrice && Number(course.discountedPrice) > 0) ? Number(course.discountedPrice) : Number(course.totalPrice);

    // verify amount matches course price or discounted price
    if (Number(amount) !== Number(expectedAmount)) {
      return res.status(400).json({ error: 'Payment amount does not match course price' });
    }

    // record enrollment with source 'purchase'
    const existing = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existing) return res.json({ message: 'Already enrolled' });

    const enroll = new Enrollment({ course: courseId, student: studentId, source: 'purchase' });
    await enroll.save();

    // Create a payment record and credit the teacher's balance
    const teacherId = course.createdBy;
    const payment = new Payment({ course: courseId, student: studentId, teacher: teacherId, amount: Number(amount), method: paymentMethod });
    await payment.save();

    // Credit teacher balance (simple wallet)
    const teacher = await User.findById(teacherId);
    if (teacher) {
      teacher.balance = (teacher.balance || 0) + Number(amount);
      await teacher.save();
    }

    res.json({ message: 'Payment successful and enrolled', enroll, payment });
  } catch (err) {
    console.error('Error in purchaseCourse:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a Razorpay order for the course amount
exports.createRazorpayOrder = async (req, res) => {
  try {
    // require razorpay lazily so server can start even if package isn't installed yet
    let Razorpay;
    try {
      Razorpay = require('razorpay');
    } catch (e) {
      console.error('Razorpay module not found. Install with `npm install razorpay` in backend.');
      return res.status(500).json({ error: 'Razorpay module not installed. Please install razorpay in backend.' });
    }
    const courseId = req.params.id;
    const studentId = req.user ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: 'Login required' });

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.pricingPlan !== 'one-time') return res.status(400).json({ error: 'Course is not a paid one-time course' });

    // Ensure teacher payout details exist
    if (!course.payoutDetails || !course.payoutDetails.accountNumber) {
      return res.status(400).json({ error: 'Teacher payout details missing' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) return res.status(500).json({ error: 'Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env' });

    const instance = new Razorpay({ key_id, key_secret });
    // Use discountedPrice when present, otherwise fall back to totalPrice
    const chargeAmount = (course.discountedPrice && Number(course.discountedPrice) > 0) ? Number(course.discountedPrice) : Number(course.totalPrice);
    const amountInPaise = Math.round(chargeAmount * 100);
    // Razorpay restricts receipt length to <= 40 characters.
    // Build a short receipt id using parts of courseId and timestamp to ensure uniqueness within the length limit.
    const receiptId = `rcpt_${String(courseId).slice(-6)}_${String(Date.now()).slice(-6)}`; // typically ~18 chars
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: { courseId, studentId }
    };
    const order = await instance.orders.create(options);
    // Return the order and the computed charge amount so frontend can display correctly
    res.json({ order, key_id, chargeAmount });
  } catch (err) {
    console.error('Error creating razorpay order:', err);
    // Return detailed message in dev to help debugging (do NOT leak in production)
    const msg = err && err.message ? err.message : 'Failed to create order';
    res.status(500).json({ error: 'Failed to create order', detail: msg });
  }
};

// Verify Razorpay payment signature and finalize enrollment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const studentId = req.user ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: 'Login required' });

    const course = await Courses.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) return res.status(500).json({ error: 'Razorpay secret not configured' });

    const generated_signature = crypto.createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // At this point payment is verified. Create enrollment & payment record, credit teacher.
    const existing = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existing) return res.json({ message: 'Already enrolled' });

    const enroll = new Enrollment({ course: courseId, student: studentId, source: 'purchase' });
    await enroll.save();

    // create payment log (amount taken from discountedPrice or totalPrice)
    const teacherId = course.createdBy;
    const chargeAmountVerify = (course.discountedPrice && Number(course.discountedPrice) > 0) ? Number(course.discountedPrice) : Number(course.totalPrice);
    const payment = new Payment({ course: courseId, student: studentId, teacher: teacherId, amount: chargeAmountVerify, method: 'razorpay' });
    await payment.save();

    // credit teacher
    const teacher = await User.findById(teacherId);
    if (teacher) {
      teacher.balance = (teacher.balance || 0) + Number(chargeAmountVerify);
      await teacher.save();
    }

    res.json({ message: 'Payment verified, enrolled', enroll, payment });
  } catch (err) {
    console.error('Error verifying razorpay payment:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Optional webhook endpoint for Razorpay events (configure RAZORPAY_WEBHOOK_SECRET)
exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];
    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (expected !== signature) return res.status(400).send('invalid signature');
    }

    // handle events as needed (payment.captured etc.)
    console.log('Razorpay webhook received', req.body.event);
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook error', err);
    res.status(500).send('error');
  }
};

// List enrollments for the logged-in student (with course details)
exports.listEnrollmentsForStudent = async (req, res) => {
  try {
    const studentId = req.user ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: "Login required" });

    // Primary source: Enrollment collection
    const enrollments = await Enrollment.find({ student: studentId }).populate("course").sort({ enrolledAt: -1 });

    // Secondary: legacy course-level arrays (if any). Look for common field names used historically.
    const legacyCourses = await Courses.find({
      $or: [
        { students: studentId },
        { enrolledStudents: studentId },
        { learners: studentId },
        { participants: studentId },
      ],
    });

    // Convert legacy courses to enrollment-like objects and avoid duplicates
    const existingCourseIds = new Set(enrollments.map((e) => e.course && e.course._id.toString()));
    const legacyEnrollments = legacyCourses
      .filter((c) => !existingCourseIds.has(c._id.toString()))
      .map((c) => ({ _id: `legacy_${c._id}`, course: c, enrolledAt: c.createdAt || new Date(0), source: "legacy" }));

    // Return combined list: primary enrollments first, then legacy
    res.json([...enrollments, ...legacyEnrollments]);
  } catch (err) {
    console.error("Error in listEnrollmentsForStudent:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List enrollments for a specific course (teacher view)
exports.listEnrollmentsForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) return res.status(400).json({ error: 'course id required' });

    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'username email');

    res.json({ count: enrollments.length, students: enrollments.map(e => e.student) });
  } catch (err) {
    console.error('Error in listEnrollmentsForCourse:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
