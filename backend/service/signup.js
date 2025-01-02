const bcrypt = require("bcrypt");
const sqlDatabase = require("../databse");

async function createUser(userData) {
    const { email, name, password, mobile_number, address, department, designation, manager_id = null ,doj} = userData;
    console.log(userData)

    const requiredFields = ['email', 'name', 'password', 'mobile_number', 'address', 'department', 'designation','doj'];
    for (const field of requiredFields) {
        if (!userData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    try {
        const [existingUsers] = await sqlDatabase.query("SELECT * FROM employees WHERE email = ?", [email]);
        if (existingUsers && existingUsers.length > 0) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO employees 
            (name, email, password, mobile_number, address, manager_id, department, designation,doj) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        const values = [name, email, hashedPassword, mobile_number.toString(), address, manager_id, department, designation,doj];

        const [insertResult] = await sqlDatabase.query(query, values);

        if (!insertResult || !insertResult.insertId) {
            throw new Error("Failed to insert new user");
        }
        return {
            id: insertResult.insertId,
            name,
            email,
            mobile_number,
            address,
            manager_id,
            department,
            designation,
            doj
        };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

module.exports = { createUser };
