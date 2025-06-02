const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    name: { type: String, required:true }
});

module.exports = mongoose.model('institution',institutionSchema);