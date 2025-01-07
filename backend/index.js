const express=require("express")
const app=express()
const dotenv=require('dotenv').config()
const cors=require("cors")
const signup=require("./router/signup")
const login=require("./router/login")
const user=require("./router/Alluser")
const project=require("./router/project")
const task=require("./router/task")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['https://task-front-mu.vercel.app','http://localhost:5173'], // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
}))


app.get("/raj",(req,res)=>{
    res.send("Welcome to the project")
})
app.use(signup)
app.use(login)
app.use(user)
app.use(project)
app.use(task)
app.listen(8080,()=>{
    console.log(`server is running on port 8080`)
})
