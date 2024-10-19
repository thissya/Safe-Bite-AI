const user =  require('../Model/User');

module.exports.update_medical_condition = async (req,res)=>{
    try{
        const{age,gender,user_id,medicalCondition}=req.body;

        const exist_user= await user.findById(user_id);

        if(!exist_user){
            return res.status(400).json({msg:"User Not Found"});
        }
       
        exist_user.age = age || exist_user.age;
        exist_user.gender = gender || exist_user.gender;
        exist_user.medicalCondition = medicalCondition || exist_user.medicalCondition;

        await exist_user.save();
        res.status(200).json({msg:"Medical Condition Updated Successfully",uses:exist_user});
    }catch(err){
        res.status(500).json(err.message);
    }
}

