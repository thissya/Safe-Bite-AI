const user =  require('../Model/User');

module.exports.update_medical_condition = async (req,res)=>{
    try{
        const{user_id,medicalCondition}=req.body;

        const exist_user= await user.findById(user_id);

        if(!exist_user){
            return res.status(400).json({msg:"User Not Found"});
        }
        if (!Array.isArray(medicalCondition)) {
            return res.status(400).json({ msg: "Medical Condition should be an array" });
        }

        exist_user.medicalCondition = [...exist_user.medicalCondition, ...medicalCondition];
        await exist_user.save();
        res.status(200).json({msg:"Medical Condition Updated Successfully"});

    }catch(err){
        res.status(500).json(err.message);
    }
}

