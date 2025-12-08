const router= require("express").Router()

const contatcController=require("../controllers/contact.controllers")


router.get("/form",contatcController.showRegisterContactPage)
router.post("/",contatcController.registerContact)
router.get("/",contatcController.showConatctPage)

module.exports=router;