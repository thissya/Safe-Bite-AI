const user = require('../model/User');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const { Buffer } = require('buffer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.update_medical_condition = async (req,res)=>{
    try{
        const{age,gender,user_id,medicalCondition}=req.body;
    
        const exist_user= await user.findOne({email:req.user.id});

        if(!exist_user){
            console.log('no user')
            return res.status(400).json({msg:"User Not Found"});
        }
       
        exist_user.age = age || exist_user.age;
        exist_user.gender = gender || exist_user.gender;
        exist_user.medicalCondition = medicalCondition || exist_user.medicalCondition;

        await exist_user.save();
        res.status(200).json({msg:"Medical Condition Updated Successfully",uses:exist_user});
    }catch(err){
        console.log(err);
        res.status(500).json(err.message);
    }
}

