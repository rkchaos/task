const express=require('express')
const router=express.Router()
const authMiddleware=require("../utils/authmiddleware")
const userController=require("../controllers/allUserController")



router.get("/user",authMiddleware.authenticateJWT,userController.allUser)
router.get("/particular_manager_employee",authMiddleware.authenticateJWT,userController.particular)
router.get("/with",authMiddleware.authenticateJWT,userController.getTeamWithProjects)
router.get("/employee",authMiddleware.authenticateJWT,userController.getEmployeeTeam)








module.exports=router