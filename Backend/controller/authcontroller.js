const user  = require('../Model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.use(express.json());

const signup = async(req,res)=>{
    try{
        
        const {email,password}=req.body;
        const hashedpassword= await bcrypt.hash(password,10);
        const newUser= new user({ email,password: hashedpassword });
        await newUser.save();
        res.status(200).json({msg:"User Created Successfully"});
    }catch(err){
        res.status(500).json(err.message);
    }
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }
        const exist_user = await user.findOne({email});
        
        if(!exist_user || !await bcrypt.compare(password,exist_user.password)){
            return res.status(400).json({msg:"Invalid Credentials"});
        }

        const token = jwt.sign({id:exist_user._id},process.env.KEY);
        const firstlogin = !exist_user.medicalCondition || exist_user.medicalCondition.length === 0;
        
        res.status(200).json({token,firstlogin});

    }catch(err){
        res.status(500).send(err.message);
    }
}

module.exports = {signup,login};
