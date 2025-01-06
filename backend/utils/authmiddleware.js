const jwt = require('jsonwebtoken');
const secret=require("../controllers/jwtConfigs")


const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }

    try {
        
        const decoded = jwt.verify(token, secret.secret);
        // console.log(decoded)
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

function verifyToken(token){
    return jwt.verify(token, secret.secret);

}

module.exports = {authenticateJWT,verifyToken};
