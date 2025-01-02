const sqlDbconnect = require("../databse")


exports.data = async (req, res) => {
    const userdata = [{ name: "raj", age: "12" }]
    res.send(userdata)
}

exports.userData = async (req, res) => {
    const { name, email } = req.body;

    const sql = "INSERT INTO tbl_user_registration (name, email) VALUES (?, ?)";

    sqlDbconnect.query(sql, [name, email], (err, result) => {
        if (!err) {
            res.status(200).json("User registration successfully");
        } else {
            console.error(err); // Log the error for debugging
            res.status(400).json("User registration failed");
        }
    });
};
