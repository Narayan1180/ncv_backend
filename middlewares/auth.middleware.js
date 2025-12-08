
const jwt = require("jsonwebtoken")
const auth= async(req,res,next)=>{

        try {
            token=req.cookies.token;
            
            if (!token){
                return res.redirect("/")}
    
            decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            req.user=decoded;
            console.log(req.user,decoded)
            next()
        } catch (error) {
            console.error(error)
            res.clearCookie("token")
            res.redirect("/")
        }
    
}

module.exports=auth;