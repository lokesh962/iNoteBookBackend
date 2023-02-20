const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser=require('../middleware/fetchUser')

const JWT_SECRET='lokeshisagoodboy';


//ROUTE 1- create a user using: POST"/api/auth/createUser" Doesnot require Auth..no login required 
router.post('/createUser', [
  body('name', 'enter valid name').isLength({ min: 3 }),
  body('email', 'enter valid email').isEmail(),
  body('password', 'enter valid password').isLength({ min: 5 }),
], async (req, res) => {

  let success=false;
  //if there are errors,returns bad request and error.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  };

  //check whether the user with this email exixts already.
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success,error: "sorry.user with this email is alredy exixts", "status": "user not created" })
    }

    const salt=await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt);

    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    }) 
 const data={
  user:{
    id:user.id
    // name:user.name
  }
 }
    const authToken=jwt.sign(data,JWT_SECRET);
    
    success=true;
    res.json({success,authToken});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("INTERNAL SERVER ERROR")
  };

});






//ROUTE 2 -authenticate  a user using: POST"/api/auth/login" no login required 

router.post('/login', [
  body('email', 'enter valid email').isEmail(),
  body('password','password cannot be blank').exists()
], async (req, res) => {
  let success=false;
   //if there are errors,returns bad request and error.
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   };
 
   const {email,password} = req.body;

   try {
    let user=await User.findOne({email});
    if(!user){
     success=false;
      return res.status(400).json({success,error:"please try to login with correct credentials"})
    }
    const passwordCompare=await bcrypt.compare(password,user.password);

    if(!passwordCompare){
      return res.status(400).json({error:"please try to login with correct credentials"})
    };

    const data={
      user:{
        id:user.id
      }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authToken});

   } catch (error) {
    console.error(error.message);
    res.status(500).send("INTERNAL SERVER ERROR")
  };
});

//ROUTE 3 - get logged in user details using post.login required

router.post('/getUser',fetchUser,async (req,res)=>{
  
  try {
  const userid=req.user.id;
  const user=await User.findById(userid).select("-password");
  res.send(user);
  
  
}catch (error) {
  console.error(error.message);
  res.status(500).send("INTERNAL SERVER ERROR")
};
})





// console.log(req.body);
// const user=User(req.body);
// user.save();


module.exports = router;