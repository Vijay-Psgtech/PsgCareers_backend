const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModels.js');
const sendVerificationEmail = require('../utils/sendVerificationMail.js');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail.js');
const logLoginActivity = require('../utils/logLoginActivity.js'); // ✅ IMPORTED

const generateToken = (userId,institution,role) => {
  return jwt.sign({ id: userId, institution: institution, role:role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Login
const login = async(req,res) =>{
  const { password } = req.body;
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:'User not found'});

  if(!user.isVerified) {
    return res.status(400).json({message:'Email not verified'});
  }

  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.status(401).json({message:'Invalid Password'});

  const token = generateToken(user._id,user.institution,user.role);
  
  // ✅ Log login event
  await logLoginActivity(user.userId, req);

  res.status(200).json({message:'Login successful', token, role:user.role, name:user.first_name, userId:user.userId, jobCategory:user.jobCategory});
}

// Register
const register = async(req,res) =>{
  const {first_name, last_name, mobile,  jobCategory, institution, role} = req.body;
  const email = req.body.email.toLowerCase();

  const exisiting = await User.findOne({email});
  if(exisiting) return res.status(400).json({message:'Email Already exists'});

  const token = crypto.randomBytes(32).toString('hex');
  const user = new User({first_name, last_name, mobile, email, jobCategory, institution, role, verificationToken:token, verificationTokenExpires:Date.now() + 3600000});
  
  await user.save();
  await sendVerificationEmail(email, token);
  res.json({ message: 'Verification email sent' });
}

// verification-mail
const verify_mail = async(req,res) => {
  const {token} = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified', userId: user._id });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }

}

// set-password
const set_password = async(req,res) => {
  const { id } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);
  if (!user || !user.isVerified) return res.status(400).json({ message: 'Unauthorized' });

  const hashed_password = await bcrypt.hash(password, 10); 

  user.password = hashed_password;
  user.confirm_password = hashed_password;
  user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;

  await user.save();
  res.json({message:'Password set successfully..',userId:user._id});

}

// forgot-password
const forgot_password = async(req,res)=>{
 const email = req.body.email.toLowerCase();
  
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:'No use with that email'});

  const token = jwt.sign({userId : user._id},process.env.JWT_SECRET,{expiresIn:'10m'});
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000;
  await user.save();

  // Send reset password email (different message)
  await sendResetPasswordEmail(user.email, token);

  res.json({ message: 'Password reset link has been sent to your mail...',token:`${token}`});
  
}

// reset-password
const reset_password = async(req,res)=>{
  const {token,password} = req.body;
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if(!user) return res.status(400).json({error:'Invalid token or user'});

    const hashed_password = await bcrypt.hash(password, 10); 
    user.password = hashed_password;
    user.confirm_password = hashed_password;
    await user.save();
    res.json({message:"Password reset succesfully!"});
  }catch(err){
    res.status(400).json({error:'Invalid or expired token'});
  }
}

module.exports = {login,register,forgot_password,reset_password,verify_mail,set_password};