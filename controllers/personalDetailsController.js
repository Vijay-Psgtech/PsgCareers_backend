const PersonalDetails = require("../models/personalDetails");

exports.getPersonalDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await PersonalDetails.findOne({ userId }).lean();

    if (!data) {
      return res.status(402).json({ message: "Personal details not found." });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};  

exports.savePersonalDetails = async (req, res) => {
  const {
    userId,
    // jobId,
    fullName,
    dob,
    gender,
    motherTongue,
    religion,
    community,
    category,
    maritalStatus,
    spouseName,
    fatherName,
    physicallyChallenged,
    natureOfChallenge,
    aadhar,
    pan,
    mobile,
    email,
    permanentAddress,
    permanentCity,
    permanentState,
    permanentCountry,
    permanentPincode,
    communicationAddress,
    communicationCity,
    communicationState,
    communicationCountry,
    communicationPincode,
  } = req.body;

  let languagesKnown = [];
  try {
    if (req.body.languagesKnown) {
      languagesKnown = JSON.parse(req.body.languagesKnown);
    }
  } catch {
    languagesKnown = [];
  }

  const photoFile = req.files?.photo?.[0];
  const resumeFile = req.files?.resume?.[0];

  try {
    // Find if record exists, update or create
    let record = await PersonalDetails.findOne({ userId });

    const updateData = {
      fullName,
      dob,
      gender,
      motherTongue,
      religion,
      community,
      category,
      maritalStatus,
      spouseName,
      fatherName,
      physicallyChallenged,
      natureOfChallenge,
      aadhar,
      pan,
      mobile,
      email,
      permanentAddress,
      permanentCity,
      permanentState,
      permanentCountry,
      permanentPincode,
      communicationAddress,
      communicationCity,
      communicationState,
      communicationCountry,
      communicationPincode,
      languagesKnown,
    };

    if (photoFile) {
      updateData.photoUrl = photoFile.path;
    }
    if (resumeFile) {
      updateData.resumeUrl = resumeFile.path;
    }

    if (record) {
      // If new files are uploaded, optionally delete old files here
      record = await PersonalDetails.findOneAndUpdate({ userId }, updateData, { new: true });
    } else {
      record = new PersonalDetails({ userId, ...updateData });
      await record.save();
    }

    res.status(200).json({ message: "Personal details saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save personal details." });
  }
};
