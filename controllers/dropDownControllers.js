const location = require('../models/locationModels');
const institution = require('../models/institutionModels');

exports.getLocations = async(req,res) => {
    const locations = await location.find();
    res.json(locations);
}

exports.getInstitutions = async(req,res) => {
    const institutions = await institution.find();
    res.json(institutions);
}

exports.addInstitution = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const exists = await institution.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    if (exists) return res.status(409).json({ message: 'Institution already exists' });

    const newInstitution = new institution({ name });
    await newInstitution.save();

    res.status(201).json(newInstitution);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
