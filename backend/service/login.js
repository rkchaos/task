const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwtutils");
const sqlDatabase = require("../databse");

async function login(email, password) {
    try {
       
        const [rows] = await sqlDatabase.query(
            "SELECT * FROM employees WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            throw new Error("User not found");
        }

        const existingUser = rows[0];

       
        const isPassword = await bcrypt.compare(password, existingUser.password);
        if (!isPassword) {
            throw new Error("Invalid password");
        }

        
        const token = generateToken({
            employee_id: existingUser.employee_id,  
            email: existingUser.email,
            name: existingUser.name,
            mobile_number: existingUser.mobile_number,  
            address: existingUser.address,
            manager_id: existingUser.manager_id,
            department: existingUser.department,
            designation: existingUser.designation,
            doj: existingUser.doj  
        });

        return token;
    } catch (err) {
        console.error("Login error:", err.message);
        throw new Error("Invalid credentials");
    }
}

module.exports = { login };
