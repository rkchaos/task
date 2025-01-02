


const authservices = require("../service/login")





exports.login=async(req,res)=>{
    try {
        const { email, password } = req.body
        const token = await authservices.login(email, password)
        res.json({ token })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ msg: "invalid credentials" })
    }
}