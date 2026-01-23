const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OtherDetails = require('../models/otherDetailModel');

const router = express.Router();

const uploadDir = path.join('uploads/otherDetails');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Only PDF, JPG, PNG allowed.'), false);
    }
    cb(null, true);
  }
}).array('documents');

// ✅ CREATE / UPDATE OtherDetails
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max limit is 50MB.' });
      }
      if (err.message.includes('Unsupported file type')) {
        return res.status(400).json({ message: err.message });
      }
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }

    try {
      const {
        userId, reference1, reference2, lastPay,
        expectedPay, joiningTime, relativesAtPSG,
        attendedPSGInterview, vacancySource, otherComments
      } = req.body;

      const documents = {};
      req.files?.forEach(file => {
        const label = file.originalname.split('-')[0]?.trim() || `doc${Date.now()}`;
        documents[label] = file.path;
      });

      let existingDetails = await OtherDetails.findOne({ userId });

      if (existingDetails) {
        existingDetails.reference1 = JSON.parse(reference1 || '{}');
        existingDetails.reference2 = JSON.parse(reference2 || '{}');
        existingDetails.lastPay = lastPay;
        existingDetails.expectedPay = expectedPay;
        existingDetails.joiningTime = joiningTime;
        existingDetails.relativesAtPSG = relativesAtPSG;
        existingDetails.attendedPSGInterview = attendedPSGInterview;
        existingDetails.vacancySource = vacancySource;
        existingDetails.otherComments = otherComments;

        for (const [label, path] of Object.entries(documents)) {
          existingDetails.documents.set(label, path);
        }

        await existingDetails.save();
        return res.status(200).json({ message: 'Other details updated successfully' });
      } else {
        const newDetails = new OtherDetails({
          userId,
          reference1: JSON.parse(reference1 || '{}'),
          reference2: JSON.parse(reference2 || '{}'),
          lastPay,
          expectedPay,
          joiningTime,
          relativesAtPSG,
          attendedPSGInterview,
          vacancySource,
          otherComments,
          documents,
        });

        await newDetails.save();
        return res.status(200).json({ message: 'Other details saved successfully' });
      }
    } catch (err) {
      console.error('Error saving/updating other details:', err);
      return res.status(500).json({ message: 'Failed to save/update other details' });
    }
  });
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const details = await OtherDetails.findOne({ userId });
    if (!details) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(details);
  } catch (err) {
    console.error('Error fetching other details:', err);
    res.status(500).json({ message: 'Failed to fetch details' });
  }
});


// ✅ DELETE a single document by label
router.delete('/document/:userId/:label', async (req, res) => {
  const { userId, label } = req.params;

  try {
    const otherDetails = await OtherDetails.findOne({ userId });
    if (!otherDetails) return res.status(404).json({ message: 'User not found' });

    const filePath = otherDetails.documents.get(label);
    if (!filePath) return res.status(404).json({ message: 'Document not found' });

    // Delete from DB
    otherDetails.documents.delete(label);
    await otherDetails.save();

    // Delete from file system
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});



module.exports = router;

