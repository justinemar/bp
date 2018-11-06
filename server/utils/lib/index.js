const jwt = require('jsonwebtoken');
require('dotenv').config();


 module.exports = {
    setToken: payload => jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800, // expires in 30 minutes
     }),


};
