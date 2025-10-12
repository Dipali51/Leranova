const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pricingPlan: {
    type: String,
    enum: ['free', 'one-time'],
    default: 'free'
  },
  totalPrice: {
    type: Number,
    required: function () { return this.pricingPlan === 'one-time'; }
  },
  discountedPrice: {
    type: Number
  },

  coverImage: {
    type: String,
    required: false
  },

  instructor: {
    type: String,
    required: false,
  },

  // Payout / bank details for paid courses (teacher payout information)
  payoutDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    beneficiaryName: { type: String },
    payoutProof: { type: String }, // path to uploaded proof (image/pdf)
  },

  // Legacy PDFs array (kept for backwards compatibility)
  pdfs: [
    {
      title: String,
      url: String,
    }
  ],

  // New structured chapters array. Each chapter can have a video, assignments and notes (pdfs)
  chapters: [
    {
      title: { type: String },
      description: { type: String },
      videoUrl: { type: String },
      assignments: [
        {
          title: String,
          url: String,
        }
      ],
      notes: [
        {
          title: String,
          url: String,
        }
      ],
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ya "Teacher" agar alag model hai
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
