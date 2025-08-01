const Application = require('../models/ApplicationModel');
const JobPost = require('../models/jobPostModels');
const User = require('../models/userModels');
const ApplicationDrafts = require('../models/ApplicationDraft');
const PersonalDetails = require("../models/personalDetails");

exports.appliedCandidates = async (req, res) => {
  try {
    const { status } = req.query;

    // Initial query from Application collection
    let initialMatch = {};

    if (status) {
      initialMatch.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }
    console.log('status', initialMatch);
    const pipeline = [
      { $match: initialMatch },

       // Lookup personal details
      {
        $lookup: {
          from: "personaldetails",
          localField: "userId",
          foreignField: "userId",
          as: "personalDetails"
        }
      },
      { $unwind: { path: "$personalDetails", preserveNullAndEmptyArrays: true } },

      // Lookup job details
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "jobId",
          as: "jobposts"
        }
      },
      { $unwind: { path: "$jobposts", preserveNullAndEmptyArrays: true } },

      // Institution-based filter (only after jobposts is joined)
      ...(req.user.role === 'admin'
      ? [{ $match: { "jobposts.institution": req.user.institution } }]
      : []),

      {
        $group: {
          _id: '$userId',
          name: { $first: '$personalDetails.fullName'},
          mobile: { $first: '$personalDetails.mobile'},
          email: { $first: '$personalDetails.email'},
          resume: { $first: '$personalDetails.resumeUrl' },
          totalApplications: { $sum: 1 },
          jobTitles: { $addToSet: '$jobposts.jobTitle' }, // Optional: collect job titles
          institution: { $addToSet: '$jobposts.institution' },
          jobCategory: { $first: '$jobposts.jobCategory' },
          latestAppliedDate: { $max: '$createdAt' }
        }
      },

      // Project fields you need
      {
        $project: {
          name: 1,
          email: 1,
          mobile: 1,
          resume: 1,
          totalApplications: 1,
          jobTitles: 1,
          latestAppliedDate: 1,
          institution: 1,
          jobCategory: 1
        }
      },
      { $sort: { latestAppliedDate: -1 } },
    ];

    const results = await Application.aggregate(pipeline);

    return res.status(200).json({ success: true, results });
  } catch (err) {
    console.error("Error in appliedCandidates:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.registeredNotApplied = async(req, res) => {
  try{
    const appliedUserIds = await Application.distinct('userId');

    const users = await User.aggregate([
      {
        $match: {
          userId: { $nin: appliedUserIds },
          role: 'user',
        },
      },
      {
        $lookup: {
          from: 'personaldetails', // collection name (note: lowercase and plural by MongoDB convention)
          localField: 'userId',
          foreignField: 'userId',
          as: 'personalInfo',
        },
      },
      {
        $unwind: {
          path: '$personalInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          mobile: 1,
          jobCategory: 1,
          createdAt: 1,
          resume: '$personalInfo.resumeUrl',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(users);
  }catch(err){
    console.error("Error in registered not applied candidates:", err);
    return res.status(500).json({ sucess: false, message: "Server Error" });
  }
}

exports.ApplicationDraftCandidates = async(req, res) => {
  try{
    const Drafts = await ApplicationDrafts.find().sort({ createdAt: -1});
    res.json(Drafts);
  }catch(err){
    console.error("Error in ApplicationDrafts:", err);
    return res.status(500).json({ sucess: false, message: "Server Error" });
  }
}