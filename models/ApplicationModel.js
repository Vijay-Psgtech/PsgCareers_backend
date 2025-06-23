const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: String, required: true },
  applicationId: { type: String },
  personalDetails: Object,
  educationDetails: Object,
  researchDetails: Object,
  workExperience: Object,
  otherDetails: Object,
  isSubmitted: { type: Boolean, default: false },
  status: { type: String, default: 'Draft' },
  stage:{type: String , default: 'Applied' },
  rejectedAtStage: { type: String, default: null },
  remarks: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);