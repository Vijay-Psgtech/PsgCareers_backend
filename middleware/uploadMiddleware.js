const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload directory
const profileUploadDir = path.join(__dirname, '../uploads/profiles');

// Ensure directory exists
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Define storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, `photo_${uniqueSuffix}${ext}`);
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only .jpg, .jpeg, .png formats allowed!'));
  }
  cb(null, true);
};

// Set upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = upload;
;
