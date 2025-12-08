const router= require("express").Router()

const authControllers = require("../controllers/auth.controllers")



router.get("/login",authControllers.showLoginpage)

router.get("/register",authControllers.showRegisterPage)

router.post("/login",authControllers.loginUser)

router.post("/register",authControllers.registerUser)

router.get("/logout",authControllers.logoutUser)

module.exports=router;

