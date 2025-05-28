const location = require('../models/locationModels');

const getLocations = async(req,res)=>{
    const locations = await location.find();
    res.json(locations);
}

module.exports = getLocations;