const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config()


exports.setToken = (payload) => {
     return jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800 // expires in 30 minutes
     });
}