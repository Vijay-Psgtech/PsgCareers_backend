const express = require('express');
const router = express.Router();
const { getWorkExperienceDetails,saveWorkExperienceDetails } = require('../controllers/workExperienceController');
const multer = require("multer");
const path = require("path");


// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});


router.get('/get',getWorkExperienceDetails);

router.post(
  "/save",
  upload.fields([
    { name: 'teachingCertificates', maxCount: 10 },
    { name: 'industryCertificates', maxCount: 10 }
  ]),
 saveWorkExperienceDetails
);

module.exports = router;