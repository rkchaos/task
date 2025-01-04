const express=require("express")
const route=express.Router()
const projectController=require("../controllers/projectController")
const authMiddleware=require("../utils/authmiddleware")


route.post("/project",projectController.project)
route.get("/projectManager",authMiddleware.authenticateJWT,projectController.Allprojects)
route.get("/AllProject",authMiddleware.authenticateJWT,projectController.Allproject)
route.get("/project/name",authMiddleware.authenticateJWT,projectController.byname)



module.exports=route