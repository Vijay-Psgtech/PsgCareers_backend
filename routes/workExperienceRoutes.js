const express = require('express');
const router = express.Router();
const { getWorkExperienceDetails,saveWorkExperienceDetails } = require('../controllers/workExperienceController');
const upload = require("../middleware/uploadMiddleware");

router.get('/get',getWorkExperienceDetails);

router.post("/save",upload.any(),saveWorkExperienceDetails);

module.exports = router;