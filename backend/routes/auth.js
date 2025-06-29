const express=require('express')
const router=express.Router()
const User=require('../models/User');
router.post('/register',async (req,res)=>{
    try{
        const{username,password}=req.body;
        const user=new User({username,password});
        await user.save();
        res.json({sucess:true,user});
    }

catch(err){
res.status(500).json({error:err.message})
}
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
