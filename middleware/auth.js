const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({error:'No token'});

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(403).json({error:'Invalid Token'});
    }
}

function adminOnly(req,res,next){
    if(req.user.role!=='admin') return res.status(403).json({error:'Access Denied'});
    next();
}

module.exports = {auth,adminOnly};