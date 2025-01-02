
const userService = require("../service/signup")








exports.signup = async (req, res) => {
    try {
        const user = req.body
        const userData = await userService.createUser(user)
        res.status(201).json({ userData: userData, msg: "user created sucesfully" })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "email already exists" })
    }

}