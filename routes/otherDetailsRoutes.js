// routes/otherDetails.js
const express = require('express');
const router = express.Router();
const OtherDetails = require('../models/otherDetailModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.body.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Save or update OtherDetails along with resume file upload
router.post('/', upload.single('resume'), async (req, res) => {
  const {
    userId, jobId,
    reference1, reference2,
    lastPay, expectedPay, joiningTime,
    relativesAtPSG, attendedPSGInterview,
    vacancySource, otherComments,
  } = req.body;

  if (!userId || !jobId) {
    return res.status(400).json({ error: 'Missing userId or jobId' });
  }

  try {
    let doc = await OtherDetails.findOne({ userId, jobId });
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : (doc ? doc.resumeUrl : null);

    const newData = {
      userId,
      jobId,
      reference1: JSON.parse(reference1),
      reference2: JSON.parse(reference2),
      lastPay,
      expectedPay,
      joiningTime,
      relativesAtPSG,
      attendedPSGInterview,
      vacancySource,
      otherComments,
      resumeUrl,
    };

    if (doc) {
      await OtherDetails.updateOne({ userId, jobId }, newData);
      doc = await OtherDetails.findOne({ userId, jobId });
    } else {
      doc = new OtherDetails(newData);
      await doc.save();
    }
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save Other Details' });
  }
});

// Get OtherDetails by userId & jobId
router.get('/:userId/:jobId', async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const doc = await OtherDetails.findOne({ userId, jobId });
    if (!doc) return res.status(404).json({ error: 'Other Details not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Other Details' });
  }
});

module.exports = router;