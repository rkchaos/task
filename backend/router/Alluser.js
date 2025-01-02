const express=require('express')
const router=express.Router()
const authMiddleware=require("../utils/authmiddleware")
const userController=require("../controllers/allUserController")



router.get("/user",authMiddleware.authenticateJWT,userController.allUser)







module.exports=router