const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getApplicationCount,
  getLoginHistory,
  passwordUpdate,
} = require("../controllers/userController");

// ==============================================
// USER PROFILE ROUTES
// ==============================================

// ✅ Get user profile by userId
router.get("/:userId", getUserProfile);

// ✅ Update user profile (with optional photo upload)
router.put("/update/:userId", upload.single("profile"), updateUserProfile);

// ✅ Get number of applications submitted by user
router.get("/application/count/:userId", getApplicationCount);

// ==============================================
// PASSWORD ROUTE
// =============================================
// ✅ Update password using old and new password
router.put("/password/:userId", updatePassword);

// ==============================================
// LOGIN HISTORY ROUTE
// ==============================================

// ✅ Get login history of the user (paginated)
router.get("/login-history/:userId", getLoginHistory);

router.post("/passwordUpdate",passwordUpdate);

module.exports = router;
