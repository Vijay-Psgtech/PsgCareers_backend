const User = require('../models/userModels.js');
const bcrypt = require('bcrypt');

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
    const {first_name, last_name,  mobile, password, institution} = req.body;
    const email = req.body.email.toLowerCase();

    const exisiting = await User.findOne({ email });
    if(exisiting) return res.status(400).json({ message: 'Email Already exists'});

    const hashedPassword = await bcrypt.hash(password, 10); 

    const user = new User({
        first_name,
        last_name,
        email,
        mobile,
        institution,
        role: 'admin',
        password: hashedPassword,
        confirm_password: hashedPassword,
        isVerified: true,
    });

    await user.save();
    res.status(201).json({ message: 'Admin user created' });

}

const DeleteUser = async(req,res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({message:'Admin User Deleted'});
}

module.exports = { getAdminUsers, CreateAdmin, DeleteUser };