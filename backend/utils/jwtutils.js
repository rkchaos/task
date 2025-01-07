const jwt = require('jsonwebtoken');
const { secret } = require("../controllers/jwtConfigs");

function generateToken(user) {
    const payload = {
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        mobile_number: user.mobile_number,
        address: user.address,
        manager_id: user.manager_id,
        department: user.department,
        doj: user.doj
    };

    return jwt.sign(payload, secret, { expiresIn: 2 * 24 * 60 * 60 }); // 2 days in seconds
}

module.exports = { generateToken };
