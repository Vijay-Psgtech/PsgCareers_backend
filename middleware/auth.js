const jwt = require('jsonwebtoken');
const User = require('../models/userModels.js');

const auth = async(req,res,next) =>
{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({error:'No token'});
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch(err){
        res.status(403).json({error:'Invalid Token'});
    }
}

module.exports = auth;