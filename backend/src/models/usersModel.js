const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    name : {type : String, required :  true},
    email : {type : String , required : true, unique : true},
    password : {type : String , required : true},
    isDeleted : {type : Boolean, required : true, default : false},
    status : {type: Boolean, required : true, default : true}
},{timestamps : true});

exports.User = mongoose.model("User",userSchema);