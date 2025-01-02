const express=require("express")
const route=express.Router()
const loginContoller=require("../controllers/loginController")




route.post("/login",loginContoller.login)


module.exports=route