const mongoose = require('mongoose');

// Flexible subdocument schema (dynamic fields like books, journals, etc.)
const dynamicFieldSchema = new mongoose.Schema({}, { strict: false });

const ResearchContributionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: String, required: true }, // uniqueness constraint

  // Basic Metrics
  sci: { type: String, default: '' },
  scopus: { type: String, default: '' },
  ugc: { type: String, default: '' },
  other: { type: String, default: '' },
  scopusId: { type: String, default: '' },
  hGoogle: { type: String, default: '' },
  hScopus: { type: String, default: '' },

  // Project Metrics (same logic as National/International)
  minorProjects: { type: String, default: '' },
  majorProjects: { type: String, default: '' },

  // Patent Metrics
  appliedPatents: { type: String, default: '' },
  publishedPatents: { type: String, default: '' },
  grantedPatents: { type: String, default: '' },

  // National/International counts
  booksNational: { type: String, default: '' },
  booksInternational: { type: String, default: '' },
  chaptersNational: { type: String, default: '' },
  chaptersInternational: { type: String, default: '' },
  journalsNational: { type: String, default: '' },
  journalsInternational: { type: String, default: '' },

  // Dynamic Data Arrays
  books: [dynamicFieldSchema],
  chapters: [dynamicFieldSchema],
  journals: [dynamicFieldSchema],
  projects: [dynamicFieldSchema],
  patents: [dynamicFieldSchema],
  pdfs: [dynamicFieldSchema],
  consultancy: [dynamicFieldSchema],
  conferences: [dynamicFieldSchema],
  visits: [dynamicFieldSchema],

  
 

}, {
  timestamps: true,
});

// Enforce unique (userId + jobId) combination
ResearchContributionSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('ResearchContribution', ResearchContributionSchema);


