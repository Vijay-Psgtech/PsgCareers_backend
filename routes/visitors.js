const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.post('/landing-visit', visitorController.landingVisit);
router.get('/landing-visit-count',visitorController.landingvisitcount);

module.exports = router;