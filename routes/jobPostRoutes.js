const express = require('express');
const router = express.Router();
const {getJobs,addJobPost,jobStatusUpdate,getJobsById} = require('../controllers/jobPostControllers');

router.get('/getJobs',getJobs);
router.get('/getJobs/:jobId',getJobsById)
router.post('/addJobPost',addJobPost);
router.put('/:id/status',jobStatusUpdate);

module.exports = router;

