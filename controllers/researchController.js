const ResearchContribution = require('../models/researchModel');

exports.saveResearchContribution = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const existing = await ResearchContribution.findOne({ userId });

    if (existing) {
      const updated = await ResearchContribution.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true }
      );
      return res.status(200).json({ message: 'Research contribution updated.', data: updated });
    } else {
      const newEntry = new ResearchContribution({ userId, ...data });
      await newEntry.save();
      return res.status(201).json({ message: 'Research contribution saved.', data: newEntry });
    }
  } catch (error) {
    console.error('Error saving research contribution:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};

exports.getResearchContribution = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await ResearchContribution.findOne({ userId });
    if (!data) {
      return res.status(404).json({ message: 'No research contribution found.' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching research contribution:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
};