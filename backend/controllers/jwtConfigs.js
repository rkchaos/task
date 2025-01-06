// jwtConfigs.js
const secret = process.env.JWT_SECRET || 'fallback-secret'; 
module.exports = { secret };
