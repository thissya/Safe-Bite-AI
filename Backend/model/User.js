const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:false
    },
    gender:{
        type:String,
        required:false,
        default: "Not Set"
    },
    medicalCondition:{ 
        type:[String],
        required:false,
        default:[]
    }
});

module.exports = mongoose.model('User',UserSchema);
