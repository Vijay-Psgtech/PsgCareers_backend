const express = require("express");
const router = express.Router();
const multer = require("multer");
const ApplicationDraft = require("../models/ApplicationDraft");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Save draft route
router.post("/api/applications/save-draft", upload.single("resume"), async (req, res) => {
  const { name, email, phone, education } = req.body;
  const resumePath = req.file?.path;

  try {
    const draft = new ApplicationDraft({
      name,
      email,
      phone,
      education,
      resume: resumePath,
    });
    await draft.save();
    res.status(200).json({ message: "Draft saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save draft" });
  }
});

module.exports = router;