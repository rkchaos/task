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
    origin: ['http://localhost:5173'],
    methods: "GET,POST,PATCH,DELETE,PUT",
    credentials: true
}))


app.use(signup)
app.use(login)
app.use(user)
app.use(project)
app.use(task)
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})