const express = require('express');
const router = express.Router();
const educationDetails = require('../controllers/educationDetailsController');


router.post('/save',educationDetails.saveEducationDetails);
router.get('/get',educationDetails.getEducationDetails);

module.exports = router;