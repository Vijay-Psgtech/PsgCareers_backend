const express = require('express');
const router = express.Router();
const getLocations = require('../controllers/locationControllers');

router.get('/getLocations',getLocations);

module.exports = router;