const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    Phone:String,
},{timestamps:true})

const Contact = mongoose.model("Contact",UserSchema)

module.exports=Contact