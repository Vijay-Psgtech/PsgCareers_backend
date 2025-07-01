const mongoose = require('mongoose');

const educationEntrySchema = new mongoose.Schema({
  qualification: String,
  degree: String,
  specialization: String,
  percentage: Number,
  year: String,
  school: String,
  university: String,
  mode: String,
  type: String,
  arrears: String,
  certificate: String,         // 'Yes' or 'No'
  // certificateFile: String      // Filename if uploaded
});

const educationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  educationList: [educationEntrySchema],
  eligibilityTest: [String],
  extraCurricular: [String],
  achievements: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EducationDetails', educationSchema);