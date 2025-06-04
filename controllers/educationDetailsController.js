const EducationDetails = require('../models/EducationModel');

exports.saveEducationDetails = async (req, res) => {
  try {
    const { userId, educationList, eligibilityTest, extraCurricular, achievements } = req.body;

    const existing = await EducationDetails.findOne({ userId });

    if (existing) {
      existing.educationList = educationList;
      existing.eligibilityTest = eligibilityTest;
      existing.extraCurricular = extraCurricular;
      existing.achievements = achievements;
      await existing.save();
      return res.status(200).json({ message: 'Education details updated successfully' });
    }

    const newEntry = new EducationDetails({ userId, educationList, eligibilityTest, extraCurricular, achievements });
    await newEntry.save();

    res.status(201).json({ message: 'Education details saved successfully' });
  } catch (err) {
    console.error('Error saving education details:', err);
    res.status(500).json({ error: 'Failed to save education details' });
  }
};

exports.getEducationDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await EducationDetails.findOne({ userId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education details' });
  }
};
