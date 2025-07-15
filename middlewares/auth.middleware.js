const jwt = require('jsonwebtoken');

function verifytoken(req,res,next){
    const authHeader  = req.header('Authorization');
    if(!authHeader){
        return res.status(401).json({message:"Access Denied"});

    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Invalid token"});
    }

    try{
       const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
       req.user._id = decoded;
       next();
    }catch(err){
        res.status(401).json({message: "Invalid or token expired"});
    }
    
    
}

module.exports = verifytoken;