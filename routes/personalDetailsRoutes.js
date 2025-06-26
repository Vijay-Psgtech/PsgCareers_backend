const express = require("express");
const router = express.Router();
const personalDetailsController = require("../controllers/personalDetailsController");
const upload = require("../middleware/uploadMiddleware");

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