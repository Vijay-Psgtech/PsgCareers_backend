const express = require('express');
const router = express.Router();
const educationDetails = require('../controllers/educationDetailsController');
const upload = require("../middleware/uploadMiddleware");


// Routes
router.post('/save', upload.any(), educationDetails.saveEducationDetails);
router.get('/get', educationDetails.getEducationDetails);

module.exports = router;