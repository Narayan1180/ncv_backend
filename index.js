require("dotenv").config()
const express = require("express")
const mongoose=require("mongoose")
const Contact=require("./models/contact_schema")
const User=require("./models/User_schema")
const Register=require("./models/register")
const path= require("path")
const bcrypt=require("bcryptjs")
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser= require("cookie-parser")
const jwt=require("jsonwebtoken")
const app= express()

const authRoutes=require("./routes/auth.route")
const contatcRoutes=require("./routes/contact.route")
const authmMiddleware= require("./middlewares/auth.middleware")

const port=process.env.PORT||4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser())
app.use(express.json());
/*app.use(session({
    secret: "mysecret",     // change to env in prod
    resave: false,
    saveUninitialized: false,
        cookie: {
        maxAge: 1000 * 60 * 1, // 10 minutes
        httpOnly: true
    }

    
})); */
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

app.use(flash());
console.log(process.env.PORT)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

app.use("/",authRoutes)
app.use("/contact",authmMiddleware,contatcRoutes)


app.get("/",(req,res)=>{
    token=req.cookies.token
    if (token)
        return res.redirect("/contact")
    return res.redirect("/login");

})

app.listen(port,()=>{console.log(`app is listen to the ${port}`)})
/*const u = new User({ name: "Aman", age: 20 });
u.save();
const v=new User({name:"Narayan",age:25})
v.save().then(doc=>console.log(doc)).catch(error=>console.log(error))
app.get("/",(req,res)=>{
    res.send("<h1>Welcoem to my first Node project::</h1>")
})


app.get("/set-session", (req, res) => {
  req.session.userId = 101;   // store anything
  req.session.username = "Narayan";
  res.send("Session has been set!");
});
app.get("/check-session", (req, res) => {
  if (req.session.userId) {
    res.send(`Session active! User: ${req.session.username}, ID: ${req.session.userId}`);
  } else {
    res.send("No session found!");
  }
});
*/

/*
app.get("/",(req,res)=>{
    res.redirect("/login")
})

app.get("/login",(req,res)=>{

    //res.sendFile("/Users/ncvhome/Desktop/NodeApp/Project/public/login.html")
    return res.sendFile(path.join(__dirname, "public", "login.html"));

})
app.get("/logout",(req,res)=>{
        res.clearCookie("token")
        return res.redirect("/login");
    });


app.post("/login",async(req,res)=>{
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

})
app.get("/register",(req,res)=>{

        //res.sendFile("/Users/ncvhome/Desktop/NodeApp/Project/public/register.html")
        res.sendFile(path.join(__dirname, "public", "register.html"));



})
app.post("/register",async(req,res)=>{

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


})
app.get("/form",(req,res)=>{
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple Form</title>
</head>
<body>

    <h2>User Details Form</h2>

    <form action="/submit" method="POST">
        
        <label>Name:</label><br>
        <input type="text" name="name" required><br><br>

        <label>Age:</label><br>
        <input type="number" name="age" required><br><br>

        <label>Email:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Phone:</label><br>
        <input type="tel" name="phone" required><br><br>

        <button type="submit">Submit</button>

    </form>

</body>
</html>
`)
})


app.post("/submit",async (req,res)=>{

    try{
    name=req.body["name"]
    age=req.body["age"]
    email=req.body["email"]
    Phone=req.body["phone"] 
    const c=new Contact({name,age,email,Phone})
    c.save()
    console.log(req.body,name,age)
    res.redirect("/")
}
catch(err){
    console.error(err)
    res.send("Error in saving form.")
}
})

function auth(req,res,next){
    
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
app.get("/contact",auth,async (req,res)=>{

    try
    {
    const result= await Contact.find({})
    console.log(result)

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contacts</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f0f8ff; margin: 0; padding: 20px;">
    <h1 style="text-align:center; color: #2c3e50;">Contact List</h1>
    <ul style="list-style: none; padding: 0; max-width: 600px; margin: auto;">
`;

result.forEach(contact => {
    html += `
    <li style="
        background-color: #ffffff;
        margin: 10px 0;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    ">
        <strong>Name:</strong> ${contact.name} <br>
        <strong>Age:</strong> ${contact.age} <br>
        <strong>Email:</strong> ${contact.email} <br>
        <strong>Phone:</strong> ${contact.Phone}
    </li>
    `;
});

html += `
    </ul>
    <div style="text-align:center; margin-top: 20px;">
        <a href="/logout" style="
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        ">Logout</a>
    </div>
</body>
</html>
`;

res.send(html);

    }
    catch(err){
        console.error(err)
        res.send("Their is Error in Fetching file.. ")
    }
})
function reverse(arr){

    n=arr.length

    i=0
    j=n-1

    while (i<j){
        [arr[i],arr[j]]=[arr[j],arr[i]]
        i=i+1
        j=j-1
    }
    return arr
}
function rever_str(str){
    arr=str.split("")

    i=0
    j=arr.length-1

    while (i<j){
        [arr[i],arr[j]]=[arr[j],arr[i]]
        i++;
        j--;
    }
    return arr.join("")

}

function Fibo(n,memo){
    if (n<=1) 
        {
        return n
        }
    if (n in memo)
        return memo[n]
    memo[n]=Fibo(n-1,memo)+Fibo(n-2,memo)
    return memo[n]

}
console.log(Fibo(20,{}))

function Fibonacci(n){

    arr=[0,1]

    for(let i=2 ; i<=n;i++)
        {
        arr.push(arr[i-1]+arr[i-2])
        }
    return arr[n]

}
console.log(Fibonacci(20))
console.log("u r reversed arr is ::",reverse([1,2,3,4,5]))
console.log("u r reversed string is::",rever_str("Hello"))

app.get("/name",(req,res)=>{
    res.json({"name":"Narayan","age":25})
})

app.get("/name-api",async (req,res)=>{

    try
    {

    const response = await fetch("http://localhost:3000/name")
    const result = await response.json();
    console.log(result)
    res.send(`your requested data is ${result.name}`)
    }
    
    catch(err){
        console.error(err)
    }


})

app.listen(port,()=>{
    console.log(`my app is listening to ${port}`)
})

*/