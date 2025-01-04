const express=require('express')
const router=express.Router()
const authMiddleware=require("../utils/authmiddleware")
const taskController=require("../controllers/taskController")




router.post("/api/tasks",authMiddleware.authenticateJWT,taskController.taska)
router.get("/tasks",authMiddleware.authenticateJWT,taskController.getTasks)
// router.get("/taskbymanager",authMiddleware.authenticateJWT,taskController.getTasksForManager)


module.exports=router