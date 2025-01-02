// It help to generate token
const jwt = require('jsonwebtoken');
const { secret } = require("../controllers/jwtConfigs");

function generateToken(user) {
    const payload = {
        employee_id: user.employee_id, // Use employee_id as the unique identifier
        name: user.name,
        email: user.email,
        designation: user.designation,
        mobile_number: user.mobile_number, // Include mobile number
        address: user.address, // Include address
        manager_id: user.manager_id, // Include manager ID
        department: user.department, // Include department
        doj:user.doj
    };
    return jwt.sign(payload, secret, { expiresIn: "2d" });
}

module.exports = {
    generateToken
};
