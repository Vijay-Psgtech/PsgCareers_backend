const WorkExperienceDetails = require('../models/WorkExperienceModel');

exports.getWorkExperienceDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await WorkExperienceDetails.findOne({ userId});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch work experience details' });
  }
};

exports.saveWorkExperienceDetails = async(req,res) => {
    try {
        const { userId, teaching, industry } = req.body;
        
        const teachingList = JSON.parse(teaching || '[]');
        const industryList = JSON.parse(industry || '[]');

        const fileMap = {};
        req.files?.forEach(file => {
          const match = file.fieldname.match(/^(teachingCertificates|industryCertificates)_(\d+)$/);
          if (match) {
            console.log('reqFiles',req.files);
            const type = match[1], index = parseInt(match[2]);
            if (!fileMap[type]) fileMap[type] = {};
            fileMap[type][index] = file.path;
          }
        });

        const enrichedTeaching = teachingList.map((item, i) => ({
          ...item,
          certificate: fileMap.teachingCertificates?.[i] || item.certificate || ''
        }));

        const enrichedIndustry = industryList.map((item, i) => ({
          ...item,
          certificate: fileMap.industryCertificates?.[i] || item.certificate || ''
        }));
        
        // Upsert: Replace if existing, insert if not
        const saved = await WorkExperienceDetails.findOneAndUpdate(
        { userId },
        {
            teaching: enrichedTeaching,
            industry: enrichedIndustry,
            updatedAt: new Date()
        },
        { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Work experience saved', data: saved });
    } catch (err) {
        console.error('Error saving work experience:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}