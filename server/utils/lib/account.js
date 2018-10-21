const jwt           = require("jsonwebtoken");
const nodemailer    = require("nodemailer"); 
require('dotenv').config();


const self = module.exports = {
setToken: (payload) => {
     return jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800 // expires in 30 minutes
     });
},

sendVerification: (target_email) => {
        const verification_token = self.setToken({email: target_email});
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.GPWD
            }
          })
        
        const mailOptions = {
            from: process.env.EMAIL,
            to: target_email,
            subject: 'BIDA Account Verification',
            text: `
            Dear BIDA user,

            We are pleased that you have chosen to secure your email ${target_email}

            By verifying the email address associated with your BIDA account, you enable a higher level of account security.

            Please click the link below to complete the verification process.

            http://localhost:8080/#/verifyEmail/${verification_token}

            This message was generated by BIDA
            `
        };
 
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) { 
              console.log(error + "something strange...");
            } else {
              console.log("Message sent! " );
            }
          });
    },
    
}