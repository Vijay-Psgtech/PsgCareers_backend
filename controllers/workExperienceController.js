const WorkExperienceDetails = require('../models/WorkExperienceModel');
const path = require("path");
const fs = require("fs");

exports.getWorkExperienceDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await WorkExperienceDetails.findOne({ userId});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch work experience details' });
  }
};

exports.saveWorkExperienceDetails = async(req,res) => {
    try {
        const { userId, teaching, industry } = req.body;

        const teachingFiles = req.files['teachingCertificates'] || [];
        const industryFiles = req.files['industryCertificates'] || [];

        const parsedTeaching = JSON.parse(teaching).map((item, i) => ({
        ...item,
        certificate: teachingFiles[i]?.filename || item.certificate || ''
        }));

        const parsedIndustry = JSON.parse(industry).map((item, i) => ({
        ...item,
        certificate: industryFiles[i]?.filename || item.certificate || ''
        }));

        // Upsert: Replace if existing, insert if not
        const saved = await WorkExperienceDetails.findOneAndUpdate(
        { userId },
        {
            teaching: parsedTeaching,
            industry: parsedIndustry,
            updatedAt: new Date()
        },
        { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Work experience saved', data: saved });
    } catch (err) {
        console.error('Error saving work experience:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}