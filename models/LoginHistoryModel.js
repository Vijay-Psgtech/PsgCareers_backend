const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if storing _id
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  ip: {
    type: String,
    default: 'Unknown',
  },
  userAgent: {
    type: String,
    default: 'Unknown',
  }
});

// Optional index
loginHistorySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.models.LoginHistory || mongoose.model('LoginHistory', loginHistorySchema);






