const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visitor", visitorSchema);


