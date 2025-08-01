const mongoose = require("mongoose");

const ApplicationDraftSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  resume: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ApplicationDraft", ApplicationDraftSchema);