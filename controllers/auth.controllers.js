const bcrypt=require("bcryptjs")
const jwt= require("jsonwebtoken")
const Register=require("../models/register")
const path=require("path")
const showLoginpage= (req,res)=>{
    console.log(__dirname)
      res.sendFile(path.join(__dirname, "../public", "login.html"));

}

const showRegisterPage=(req,res)=>{
      res.sendFile(path.join(__dirname, "../public", "register.html"));

}

const registerUser= async(req,res)=>{

        try{
      const {name,email,password} = req.body
      console.log(req.body)
      const UserExist = await Register.findOne({email})

      if (UserExist){
        return res.send("User Already exist.Please login")
      }

   const hashed_password = await bcrypt.hash(password,10)
   const newUSer =  new Register({name,email,password:hashed_password})

   newUSer.save()
   return res.redirect("/login")

     
}
catch(err){
    console.error(err)
    res.redirect("/regsiter")
}

}


const loginUser = async(req,res)=>{

    try{
      const email= req.body["email"]
      //const password=req.body["password"]
      console.log(email)
      const UserExist= await Register.findOne({email})
      console.log(UserExist)
      if (UserExist){
        const match_password=await bcrypt.compare(req.body.password,UserExist.password)
        console.log(match_password)
        if (match_password){
            console.log(match_password)
            //req.session.userId = UserExist._id;
            const token= jwt.sign({id:UserExist._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE})

            res.cookie("token",token,{
                httpOnly:true,
                sameSite:"strict",

            })

            return res.redirect("/contact")}

        return res.send("Enter correct password")
      }
      res.send("Please enter correct password or register")
    }

    catch(err){
        console.error(err)
        res.redirect("/")
    }

}

const logoutUser = async(req,res)=>{
    res.clearCookie("token")

    return res.redirect("/login");
    
}

module.exports={showLoginpage,showRegisterPage,loginUser,registerUser,logoutUser}