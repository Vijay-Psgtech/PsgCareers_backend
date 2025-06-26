const Visitor = require('../models/Visitor');

// POST or UPDATE visitor count
exports.trackVisitor = async (req, res) => {
  const { userId } = req.params;
  const { institution } = req.body;

  try {
    const updatedVisitor = await Visitor.findOneAndUpdate(
      { userId, institution },
      {
        $inc: { count: 1 },
        $set: { lastVisited: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: 'Visitor tracked successfully',
      count: updatedVisitor.count,
    });
  } catch (err) {
    console.error('Error tracking visitor:', err);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

// GET visitor count
exports.getVisitorCount = async (req, res) => {
  const { userId } = req.params;
  const { institution } = req.query;

  try {
    const visitor = await Visitor.findOne({ userId, institution });
    if (!visitor) {
      return res.status(404).json({ message: 'No visitor record found' });
    }

    res.status(200).json({ count: visitor.count });
  } catch (err) {
    console.error('Error retrieving visitor count:', err);
    res.status(500).json({ error: 'Failed to retrieve visitor count' });
  }
};