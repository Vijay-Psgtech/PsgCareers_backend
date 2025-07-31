const JobPost = require('../models/jobPostModels');
const Application = require('../models/ApplicationModel');

const getJobs = async(req,res)=>{
    try {
        const { status,jobCategory } = req.query;

        let query = {};

        if (status) {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }

        if(jobCategory){
            query.jobCategory = { $regex: new RegExp(`^${jobCategory}$`, 'i') };
        }

        console.log("Query used:", query);

        const jobs = await JobPost.find(query)
        .populate('createdBy','first_name')
        .populate('updatedBy','first_name')
        .sort({createdAt:-1});
        
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const addJobPost = async(req,res)=>{
    try {
        const newJobPost = new JobPost({...req.body,createdBy: req.user._id, updatedBy: req.user._id});
        await newJobPost.save();
        res.status(201).json({ jobId: newJobPost.jobId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save job' });
    }
}

const updateJobByJobId  =async(req,res)=>{
    const { jobId } = req.params;
    const updatedData = {...req.body,updatedBy:req.user._id};

    try {
        const job = await JobPost.findOneAndUpdate({ jobId },updatedData,{ new: true });

        if (!job) {
        return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
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
     const job = await JobPost.findOne({ jobId }).populate('createdBy','first_name').populate('updatedBy','first_name');
        if (!job) {
        return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const copyJob = async (req, res) => {
    try {
        const originalJob = await JobPost.findOne({ jobId: req.params.jobId });
        if (!originalJob) return res.status(404).json({ message: "Job not found" });

        // Remove _id and jobId for the copy
        const { _id, jobId, createdAt, updatedAt, ...jobData } = originalJob.toObject();

        const copiedJob = new JobPost({ ...jobData});
        await copiedJob.save();

        res.status(201).json({ jobId: copiedJob.jobId });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const DeleteJob = async(req,res) => {
    try{
        const jobs = await JobPost.findById(req.params.id);
        if(jobs){
            const AppliedJob = await Application.findOne({jobId: jobs.jobId});
            if(AppliedJob){
                await Application.findByIdAndDelete(AppliedJob._id);
            }
        }
        await JobPost.findByIdAndDelete(req.params.id);
        res.json({message:'Job Deleted'});
    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
    
}

const JobsWithCount = async(req,res)=>{
    try{
        const { status } = req.query;
        let query = {};

        if (req.user.role === 'admin') {
            query.institution = req.user.institution;
        }

        if (status) {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }
        const jobs = await JobPost.aggregate([
            { $match: query },
            // Join with jobapplications to count candidates
            {
                $lookup: {
                    from: "applications", 
                    localField: "jobId",
                    foreignField: "jobId",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    candidateCount: { $size: "$applications" },
                    newCandidateCount : {
                        $size : {
                            $filter: {
                                input: '$applications',
                                as: "app",
                                cond: { $eq: ["$$app.status", "Submitted"] }
                            }
                        }
                    }
                }
            },
            // Join with users for createdBy
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdByUser'
                }
            },
            {
                $unwind: {
                    path: "$createdByUser",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Add only first_name from both lookups
            {
                $addFields: {
                    createdBy: "$createdByUser.first_name",
                }
            },

            {
                $project: {
                    applications: 0,
                    createdByUser: 0,
                }
            },
            // Sort by createdAt descending (latest first)
            { $sort: { createdAt: -1 } } 
        ]);
        res.status(200).json(jobs);
    } catch(error) {
        console.error("Error fetching job posts with candidate count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    getJobs,
    addJobPost,
    updateJobByJobId,
    jobStatusUpdate,
    getJobsById,
    copyJob,
    DeleteJob,
    JobsWithCount
};