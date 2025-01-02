const sqlDatabase = require("../databse"); 

exports.allUser = async (req, res) => {
    try {
        const [rows, fields] = await sqlDatabase.execute("SELECT * FROM employees"); 
        res.status(200).json({
            success: true,
            data: rows, 
            current:req.user
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
