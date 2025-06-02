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
