const express = require('express');
const router = express.Router();
const {
  saveResearchContribution,
  getResearchContribution,
} = require('../controllers/researchController');

// Save or Update Research Contribution
router.post('/:userId', saveResearchContribution);

// Get Research Contribution by userId & jobId
router.get('/:userId', getResearchContribution);

module.exports = router;
