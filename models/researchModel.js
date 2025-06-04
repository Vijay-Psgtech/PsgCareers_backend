const mongoose = require('mongoose');

// A flexible subdocument schema for dynamic arrays like books, journals, etc.
const dynamicFieldSchema = new mongoose.Schema({}, { strict: false });

// Main Research Contribution Schema
const ResearchContributionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scopusId: { type: String, default: '' },
  orcidId: { type: String, default: '' },
  hIndex: { type: String, default: '' },
  i10Index: { type: String, default: '' },
  citations: { type: String, default: '' },
  researchAreas: { type: String, default: '' },

  books: [dynamicFieldSchema],
  journals: [dynamicFieldSchema],
  conferences: [dynamicFieldSchema],
  patents: [dynamicFieldSchema],
  fundedProjects: [dynamicFieldSchema],
  consultancy: [dynamicFieldSchema],
  copyrights: [dynamicFieldSchema],
  others: [dynamicFieldSchema],
}, {
  timestamps: true,
});

// Enforce uniqueness per user-job pair
ResearchContributionSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('ResearchContribution', ResearchContributionSchema);
