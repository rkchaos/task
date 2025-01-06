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
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Authorization', 'Content-Type'], 
    optionsSuccessStatus: 200, 
}));
app.use((req, res, next) => {
    console.log('Request Details:', {
        method: req.method,
        origin: req.headers.origin,
        headers: req.headers,
    });
    next();
});


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