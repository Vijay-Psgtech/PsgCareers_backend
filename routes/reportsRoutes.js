const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportController = require('../controllers/reportsController');

router.get('/applied-candidates',auth,reportController.appliedCandidates);
router.get('/registered-not-applied',reportController.registeredNotApplied);

module.exports = router;