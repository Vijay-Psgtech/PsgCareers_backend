const JobPost = require('../models/jobPostModels');

const getJobs = async(req,res)=>{
    console.log('getjobs api');
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
        query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }

        console.log("Query used:", query);

        const jobs = await JobPost.find(query);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const addJobPost = async(req,res)=>{
    try {
        const newJobPost = new JobPost(req.body);
        await newJobPost.save();
        res.status(201).json({ jobId: newJobPost.jobId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save job' });
    }
}

const jobStatusUpdate = async(req,res)=>{
    try{
        const updatedJob = await JobPost.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true} 
        );
        res.json(updatedJob);
    }catch(err){
        res.status(500).json({ error: 'Update failed' });
    }
}

const getJobsById = async(req,res)=>{
    try {
     const { jobId } = req.params;
     const job = await JobPost.findOne({ jobId });
        if (!job) {
        return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = {getJobs,addJobPost,jobStatusUpdate,getJobsById};