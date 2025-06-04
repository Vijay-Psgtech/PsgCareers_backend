const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getJobs,
    addJobPost,
    updateJobByJobId,
    jobStatusUpdate,
    getJobsById,
    copyJob,
    DeleteJob,
    JobsWithCount
} = require('../controllers/jobPostControllers');

router.get('/getJobs',getJobs);
router.get('/getJobs/:jobId',getJobsById)
router.post('/addJobPost',auth,addJobPost);
router.put('/updateByJobId/:jobId',auth,updateJobByJobId);
router.put('/:id/status',jobStatusUpdate);
router.post('/copy/:jobId',copyJob);
router.delete('/:id',DeleteJob);
router.get('/JobsWithCount',auth,JobsWithCount);

module.exports = router;

