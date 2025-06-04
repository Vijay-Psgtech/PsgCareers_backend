const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  institution: { type: String, required: true },
  specialization: { type: String },
  address: { type: String },
  certificate: { type: String }, // Store file name or file path
  from: { type: Date },
  to: { type: Date }
}, { _id: false });

const workExperienceDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  
  teaching: { type: [experienceSchema], default: [] },
  industry: { type: [experienceSchema], default: [] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkExperienceDetails', workExperienceDetailsSchema);
