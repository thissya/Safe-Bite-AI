const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    medicalCondition:{type:[String],
        required:false
    }
});

module.exports = mongoose.model('User',UserSchema);
