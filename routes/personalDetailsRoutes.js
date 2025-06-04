const express = require("express");
const router = express.Router();
const personalDetailsController = require("../controllers/personalDetailsController");
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

// GET personal details by userId and jobId
router.get("/:userId", personalDetailsController.getPersonalDetails);

// POST save personal details with files
router.post(
  "/save",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  personalDetailsController.savePersonalDetails
);

module.exports = router;