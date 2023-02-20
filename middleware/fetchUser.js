const jwt=require('jsonwebtoken');
const JWT_SECRET='lokeshisagoodboy';

const fetchUser=(req,res,next)=>{
    //get the user from the jwt token and add id to request object

    const token=req.header('auth-token');
    if (!token) {
        res.status(400).send({error:"please authenticate using valid token"})
    };
    
    
    
    try {
        const data= jwt.verify(token,JWT_SECRET);
        // console.log(user);
        
        req.user=data.user;
        // console.log(req.user);
        // console.log(data.user);
        // console.log(data);
        next();
    } catch (error) {
        res.status(400).send({error:"please authenticate using valid token"})
    }

}


module.exports=fetchUser;