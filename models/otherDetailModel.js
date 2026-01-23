const mongoose = require('mongoose');

const otherDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  reference1: Object,
  reference2: Object,
  lastPay: String,
  expectedPay: String,
  joiningTime: String,
  relativesAtPSG: String,
  attendedPSGInterview: String,
  vacancySource: String,
  otherComments: String,
  documents: {
    type: Map,
    of: String, // label -> filepath
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('OtherDetails', otherDetailsSchema);


