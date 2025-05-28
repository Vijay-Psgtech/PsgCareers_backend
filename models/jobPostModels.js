
const mongoose = require('mongoose');
const Counter = require('./Counter');

const JobPostSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  jobTitle: { type: String, required: true },
  location: { type: String },
  gender: { type: String }, // Optional gender
  institution: { type: String },
  department: { type: String },
  jobCategory: { type: String, enum: ['Teaching', 'Non Teaching'] },
  designation: { type: String },
  grade: { type: String },
  jobType: { type: String },
  hiringType: { type: String },
  numberOfOpenings: { type: Number, default: 1 },
  jobDescription: { type: String }, // stored as HTML
  ctcCurrency: { type: String },
  ctcMin: {type: Number},
  ctcMax: { type: Number },
  experienceMin: { type: Number },
  experienceMax: { type: Number },
  status:{type:String,enum:['active','closed'],default:'active'},
  importantSkills: [{ type: String }],
}, {
  timestamps: true });

  // Auto generate jobId before saving
  JobPostSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: 'jobId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const year = new Date().getFullYear();
    this.jobId = `PSG${year}-${String(counter.seq).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('JobPost', JobPostSchema);
