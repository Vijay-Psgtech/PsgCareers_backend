const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
  name: String,
  address: String,
  designation: String,
  mobile: String,
  email: String,
});

const OtherDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  jobId: { type: String, required: true, index: true },
  reference1: ReferenceSchema,
  reference2: ReferenceSchema,
  lastPay: String,
  expectedPay: String,
  joiningTime: String,
  relativesAtPSG: String,
  attendedPSGInterview: String,
  vacancySource: String,
  otherComments: String,
  resumeUrl: String,  // For uploaded resume file URL
}, { timestamps: true });

module.exports = mongoose.model('OtherDetails', OtherDetailsSchema);