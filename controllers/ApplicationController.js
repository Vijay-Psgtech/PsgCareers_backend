const Application = require('../models/ApplicationModel');
const Counter = require('../models/Counter');


exports.submitApplication = async(req,res) => {
    const { userId, jobId } = req.params;

    try {
        let application = await Application.findOne({ userId, jobId });

        // If application already exists but not submitted, update it
        if (application && !application.isSubmitted) {
        // Generate new applicationId
            const counter = await Counter.findOneAndUpdate(
                { id: 'applicationId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const applicationId = `APP-${String(counter.seq).padStart(3, '0')}`;

            application.applicationId = applicationId;
            application.status = 'Submitted';
            application.isSubmitted = true;
            application.declaration = req.body.declaration || {};
            await application.save();

            return res.status(200).json({ success: true, applicationId });
        }

        // If already submitted
        if (application?.isSubmitted) {
        return res.status(400).json({
            success: false,
            message: 'Application already submitted for this job.',
        });
        }

        // If no record exists, create a new one (rare case)
        const counter = await Counter.findOneAndUpdate(
        { id: 'applicationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
        );

        const applicationId = `APP-${String(counter.seq).padStart(3, '0')}`;

        const newApplication = new Application({
        ...req.body,
        userId,
        jobId,
        applicationId,
        status: 'Submitted',
        isSubmitted: true,
        });

        await newApplication.save();
        return res.status(200).json({ success: true, applicationId });

    } catch (error) {
        console.error('❌ Error submitting application:', error);
        return res.status(500).json({ success: false, message: 'Server error while submitting application.' });
    }
}


exports.candidateDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const results = await Application.aggregate([
      { $match: { jobId } },

      // Lookup: Personal Details
      {
        $lookup: {
          from: "personaldetails",
          localField: "userId",
          foreignField: "userId",
          as: "personalDetails"
        }
      },
      { $unwind: { path: "$personalDetails", preserveNullAndEmptyArrays: true } },

      // Lookup: Education Details
      {
        $lookup: {
          from: "educationdetails",
          localField: "userId",
          foreignField: "userId",
          as: "educationDetails"
        }
      },

      // Lookup: Work Experience
      {
        $lookup: {
          from: "workexperiencedetails",
          localField: "userId",
          foreignField: "userId",
          as: "workExperienceDetails"
        }
      },

      // Lookup: Other Details
      {
        $lookup: {
          from: "otherdetails",
          localField: "userId",
          foreignField: "userId",
          as: "otherDetails"
        }
      },

      // Project required fields
      {
        $project: {
          userId: 1,
          jobId: 1,
          stage: 1,
          status: 1,
          rejectedAtStage: 1,
          createdAt: 1,
          remarks: 1,
          personalDetails: 1,
          educationDetails: 1,
          workExperienceDetails: 1,
          otherDetails: 1
        }
      },

      // Sort by createdAt descending (latest first)
      { $sort: { createdAt: -1 } },

      // Pagination
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ]);

    const applications = results[0].data;
    const total = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      data: applications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });

  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCandidateStage = async(req,res) => {
    const { userId, jobId, stage } = req.body;
    try{
      const application = await Application.findOne({ userId, jobId });
      if(!application){
        return res.status(404).json({message: 'Application not found'});
      }

      const updateFields = { stage };

      if(stage === 'Not Selected'){
        updateFields.rejectedAtStage = application.stage  //Previous Stage
      } else {
        updateFields.rejectedAtStage = null;   // clear rejection
      }

      await Application.findOneAndUpdate(
        { userId, jobId },
        updateFields,
        { new: true }
      );
      res.status(200).json({ message: "Stage updated" });
    } catch(err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
    
}

exports.updateCandidateStatus = async(req,res) => {
    const { userId, jobId, status } = req.body;
    await Application.findOneAndUpdate(
        { userId, jobId },
        { status },
        { new: true }
    );
    res.status(200).json({ message: "Status updated" });
}

exports.getUserApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await Application.aggregate([
      {
        $match: { userId }
      },
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "jobId", 
          as: "jobDetails"
        }
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          applicationId: 1,
          jobId: "$jobDetails.jobId",
          jobTitle: "$jobDetails.jobTitle",
          category: "$jobDetails.jobCategory",
          department: "$jobDetails.department",
          status: 1,
          stage: 1,
          rejectedAtStage: 1,
          updatedAt: 1,
          timeline: 1
        }
      }
    ]);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: "No applications found" });
    }

    return res.status(200).json({ success: true, applications });

  } catch (error) {
    console.error("Error in getUserApplications:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getUsersById= async(req,res)=>{
  const { userId } = req.params;
  try{
    const application = await Application.findOne({ userId, isSubmitted: true}).sort({ updatedAt: -1});
    if(!application) 
    {
      return res.status(404).json({ message: "No submitted applications found"});
    }
    res.status(200).json(application);
  } catch(err) {
    console.error("Error fetching sumbitted applications:", err);
    res.status(500).josn({message: 'Server error'});
  }
}

exports.updateRemarks = async (req, res) => {
  const { userId, jobId, remark } = req.body;
  try {
    const updated = await Application.findOneAndUpdate(
      { userId, jobId },
      { remarks: remark },
      { new: true }
    );
    res.status(200).json({ message: "Remarks updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
