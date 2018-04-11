const jwt = require("jsonwebtoken");
require('dotenv').config()





const verifyToken = (req, res, next) => {
        console.log('called')
        const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
        jwt.verify(token, process.env.KEY1, function(err, decoded) {
            if(err) {
                res.status(401).json({
                    message: "You're session has expired, please login again.",
                    type: 'error',
                    code: 401
                })
            }
            
            if(decoded){
                next();
            } 
        })
    }

module.exports = verifyToken;