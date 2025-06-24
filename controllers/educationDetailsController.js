const EducationDetails = require('../models/EducationModel');
const fs = require('fs');
const path = require('path');

exports.saveEducationDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const educationList = JSON.parse(req.body.educationList || '[]');
    const eligibilityTest = JSON.parse(req.body.eligibilityTest || '[]');
    const extraCurricular = JSON.parse(req.body.extraCurricular || '[]');
    const achievements = req.body.achievements || "";

    const uploadedFiles = req.files || [];

    // Attach file names to corresponding education entries
    let fileIndex = 0;
    for (let i = 0; i < educationList.length; i++) {
      if (educationList[i].certificate === 'Yes') {
        const file = uploadedFiles[fileIndex];
        if (file) {
          educationList[i].certificateFile = file.filename;
          fileIndex++;
        } else {
          educationList[i].certificateFile = "";
        }
      } else {
        educationList[i].certificateFile = "";
      }
    }

    const payload = {
      userId,
      educationList,
      eligibilityTest,
      extraCurricular,
      achievements
    };

    const existing = await EducationDetails.findOne({ userId });
    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      return res.status(200).json({ message: "Education details updated successfully" });
    }

    const newEntry = new EducationDetails(payload);
    await newEntry.save();

    res.status(201).json({ message: "Education details saved successfully" });
  } catch (error) {
    console.error("Error saving education details:", error);
    res.status(500).json({ error: "Failed to save education details" });
  }
};

exports.getEducationDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await EducationDetails.findOne({ userId });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching education details:", error);
    res.status(500).json({ error: "Failed to fetch education details" });
  }
};