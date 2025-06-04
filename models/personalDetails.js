const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  read: { type: Boolean, default: false },
  write: { type: Boolean, default: false },
  speak: { type: Boolean, default: false },
});

const personalDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // jobId: { type: String, required: true },

  fullName: { type: String },
  dob: { type: Date },
  gender: { type: String },
  motherTongue: { type: String },
  religion: { type: String },
  community: { type: String },
  category: { type: String },
  maritalStatus: { type: String },
  spouseName: { type: String },
  fatherName: { type: String },
  physicallyChallenged: { type: String },
  natureOfChallenge: { type: String },
  aadhar: { type: String },
  pan: { type: String },
  mobile: { type: String },
  email: { type: String },

  permanentAddress: { type: String },
  permanentCity: { type: String },
  permanentState: { type: String },
  permanentCountry: { type: String },
  permanentPincode: { type: String },

  communicationAddress: { type: String },
  communicationCity: { type: String },
  communicationState: { type: String },
  communicationCountry: { type: String },
  communicationPincode: { type: String },

  languagesKnown: [languageSchema],

  photoUrl: { type: String },  // store filenames or URLs
  resumeUrl: { type: String },

}, { timestamps: true });

// Compound index to avoid duplicates per user+job
personalDetailsSchema.index({ userId: 1 }, { unique: true });

const PersonalDetails = mongoose.model("PersonalDetails", personalDetailsSchema);

module.exports = PersonalDetails;



