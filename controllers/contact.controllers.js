const Contact=require("../models/contact_schema")
const auth= require("../middlewares/auth.middleware")
const showRegisterContactPage = (req,res)=>{

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple Form</title>
</head>
<body>

    <h2>User Details Form</h2>

    <form action="/contact" method="POST">
        
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
}

const registerContact=async(req,res)=>{
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
}
const showConatctPage = async(req,res)=>{

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

}

module.exports={showConatctPage,showRegisterContactPage,registerContact}