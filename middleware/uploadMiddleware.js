// ===== uploadMiddleware.js =====
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic destination based on fieldname
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/misc';

    // Map fieldname to folder
    const folderMap = {
      photo: 'uploads/personalDetails/photos',
      resume: 'uploads/personalDetails/resumes',
      educationCertificates: 'uploads/educationDetails/certificates',
      teachingCertificates: 'uploads/workExperience/teachingDocs',
      industryCertificates: 'uploads/workExperience/industryDocs',
      profile: 'uploads/profile/pictures',
    };

    for (const key in folderMap) {
      if (file.fieldname.startsWith(key)) {
        folder = folderMap[key];
        break;
      }
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = file.fieldname + '-' + Date.now();
    cb(null, `${base}${ext}`);
  }
});

module.exports = multer({ storage });
