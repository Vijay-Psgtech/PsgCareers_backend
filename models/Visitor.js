const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  institution: { type: String, required: true },
  count: { type: Number, default: 1 },
  lastVisited: { type: Date, default: Date.now },
});

// Ensure uniqueness of userId + institution
visitorSchema.index({ userId: 1, institution: 1 }, { unique: true });

module.exports = mongoose.model("Visitor", visitorSchema);


