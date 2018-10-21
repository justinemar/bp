const jwt           = require("jsonwebtoken");
const nodemailer    = require("nodemailer"); 
require('dotenv').config();


 module.exports = {
setToken: (payload) => {
     return jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800 // expires in 30 minutes
     });
},

    
}