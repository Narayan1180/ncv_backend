const { default: mongoose } = require("mongoose")


const Register_Schema = new mongoose.Schema({

    name:{
        type:String,
    },
email:{type:String,
    required:true,
    lowercase:true,
    unique:true,
    trim:true,
},
password:{
    type:String,
    required:true,
    minlegth:6
}}
)

const Register = new mongoose.model("Regsiter",Register_Schema)

module.exports=Register;
