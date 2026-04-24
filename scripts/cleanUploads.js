const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const PersonalDetails = require("../models/personalDetails");

// mongoDb connection
mongoose.connect("mongodb://localhost:27017/Careers_PSG");

async function cleanUploads() {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");

    // personalDetails photos
    const personalDetailsFolder = path.join(
      uploadsDir,
      "personalDetails/photos",
    );

    const personalDetails = await PersonalDetails.find({}, "photoUrl");

    const personalDetailsPhotos = personalDetails
      .map((e) => e.photoUrl)
      .filter(Boolean)
      .map((img) => path.basename(img));

    const photosFiles = fs.readdirSync(personalDetailsFolder);

    let deletedPhotosFiles = [];

    for (const file of photosFiles) {
      if (!personalDetailsPhotos.includes(file)) {
        const filePath = path.join(personalDetailsFolder, file);
        fs.unlinkSync(filePath);
        deletedPhotosFiles.push(file);
        console.log("Deleted profile image:", file);
      }
    }

    // personDetails resumes
    const resumeFolder = path.join(uploadsDir, "personalDetails/resumes");

    const personalDetailsResumes = await PersonalDetails.find({}, "resumeUrl");

    const resumes_personal = personalDetailsResumes
      .map((e) => e.resumeUrl)
      .filter(Boolean)
      .map((img) => path.basename(img));

    const resumeFiles = fs.readdirSync(resumeFolder);

    let deletedResumeFiles = [];

    for (const file of resumeFiles) {
      if (!resumes_personal.includes(file)) {
        const filePath = path.join(resumeFolder, file);
        fs.unlinkSync(filePath);
        deletedResumeFiles.push(file);
        console.log("Deleted Resume Files:", file);
      }
    }

    console.log("\nCleanup Completed");
    console.log("Deleted Profile Images:", deletedPhotosFiles.length);
    console.log("Deleted Resume Files:", deletedResumeFiles.length);
  } catch (err) {
    console.error("CleanUp error:", err);
    process.exit(1);
  }
}

cleanUploads();
