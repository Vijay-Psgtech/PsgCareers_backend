const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const educationDetails = require('../controllers/educationDetailsController');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/educationCertificates');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter to allow only specific types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only PDF and image files are allowed (pdf, jpg, jpeg, png).'), false);
  }
  cb(null, true);
};

// Multer upload instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max file size
});

// Routes
router.post('/save', upload.array('educationCertificates'), educationDetails.saveEducationDetails);
router.get('/get', educationDetails.getEducationDetails);

module.exports = router;