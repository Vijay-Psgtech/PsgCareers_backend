const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const Application = require('../models/ApplicationModel');
const LoginHistory = require('../models/LoginHistoryModel');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail.js');


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const updateData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      location: req.body.location,
      mobile: req.body.mobile,
      about: req.body.about
    };

    if (req.file) {
        console.log('Photo',req.file);
      updateData.photo = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      updateData,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// Get application count
const getApplicationCount = async (req, res) => {
  try {
    const count = await Application.countDocuments({ userId: req.params.userId });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching application count', error: err.message });
  }
};

// Update password
const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ userId }); // ✅ use userId instead of _id
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      changeCount: user.passwordChangeCount,
    });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};


// Get login history
const getLoginHistory = async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await LoginHistory.countDocuments({ userId });
    const history = await LoginHistory.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ total, page, limit, history });
  } catch (err) {
    res.status(500).json({ message: "Error fetching login history", error: err.message });
  }
};

const passwordUpdate =  async(req,res) => {
  const { email } = req.body;
  
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:'No user with that email'});

  const token = jwt.sign({userId : user._id},process.env.JWT_SECRET,{expiresIn:'10m'});
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000;
  await user.save();

  // Send reset password email (different message)
  await sendResetPasswordEmail(user.email, token);

  res.json({ message: 'Password reset link has been sent to your mail...',token:`${token}`});
}

// ✅ Export all
module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getApplicationCount,
  passwordUpdate,
  getLoginHistory,
};