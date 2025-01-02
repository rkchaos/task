const express =require("express")
const router=express.Router()
const conrollers=require("../controllers/signup")


router.post("/register",conrollers.signup)







module.exports=router