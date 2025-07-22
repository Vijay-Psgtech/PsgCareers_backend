const Visitor = require('../models/Visitor');

exports.landingVisit = async(req, res)=>{
  const { fingerprint } = req.body;
  if (!fingerprint) return res.status(400).json({ message: 'Missing fingerprint' });

  try {
    const existing = await Visitor.findOne({ fingerprint });
    
    if (!existing) {
      await Visitor.create({ fingerprint });
    }

    const totalCount = await Visitor.countDocuments();
    res.json({ uniqueCount: totalCount });
  } catch (err) {
    console.error('Visit tracking error:', err);
    res.status(500).json({ message: 'Error tracking visit' });
  }
}

exports.landingvisitcount = async(req, res) =>{
try {
    const totalCount = await Visitor.countDocuments();
    res.json({ uniqueCount: totalCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching count' });
  }
}