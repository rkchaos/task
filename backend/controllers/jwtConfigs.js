const crypto = require('crypto');
// generate secret in the from of hex for jwttoken
const secret=crypto.randomBytes(32).toString('hex');
module.exports={
    secret:secret
}