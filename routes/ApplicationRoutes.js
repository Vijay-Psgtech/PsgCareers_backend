const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/ApplicationController');

router.post('/submit/:userId/:jobId',applicationController.submitApplication);
router.get('/candidates/:jobId',applicationController.candidateDetails);
router.put('/updateStage',applicationController.updateCandidateStage);
router.put('/updateStatus',applicationController.updateCandidateStatus);
router.get("/status/:userId", applicationController.getUserApplications);
router.get("/getByUserId/:userId",applicationController.getUsersById);

module.exports = router;
