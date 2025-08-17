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

pdfs: [
  {
    title: String,
    url: String,
  }
],

createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ya "Teacher" agar alag model hai
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model('Courses', CourseSchema);
