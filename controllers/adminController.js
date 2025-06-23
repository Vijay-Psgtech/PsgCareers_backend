const User = require('../models/userModels.js');
const crypto = require('crypto');
const sendAdminUserVerificationMail = require('../utils/sendAdminUserVerificationMail.js');


const getAdminUsers = async(req,res) => {
    try{
        const { role } = req.query;
        let query = {};
        if(role){
            query.role = { $regex: new RegExp(`^${role}$`, 'i') };
        }

        const adminUser = await User.find(query).sort({userId:-1});
        res.json(adminUser);

    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const CreateAdmin = async (req,res) => {
    const {first_name, last_name, email, mobile, institution} = req.body;

    const exisiting = await User.findOne({ email });
    if(exisiting) return res.status(400).json({ message: 'Email Already exists'});

    const token = crypto.randomBytes(32).toString('hex');
    const user = new User({
        first_name,
        last_name,
        email,
        mobile,
        institution,
        role: 'admin',
        verificationToken: token,
        verificationTokenExpires: Date.now() + 3600000
    });

    await user.save();
    await sendAdminUserVerificationMail(email, token);

    res.status(201).json({ message: 'Admin user created and email sent' });

}

const DeleteUser = async(req,res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({message:'Admin User Deleted'});
}

module.exports = { getAdminUsers, CreateAdmin, DeleteUser };