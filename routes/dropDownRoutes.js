const express = require('express');
const router = express.Router();
const dropDownControllers = require('../controllers/dropwDownControllers');

router.get('/getLocations',dropDownControllers.getLocations);
router.get('/getInstitutions',dropDownControllers.getInstitutions);

module.exports = router;