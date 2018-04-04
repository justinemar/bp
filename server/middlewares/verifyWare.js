const jwt = require("jsonwebtoken");
require('dotenv').config()





const verifyToken = (req, res, next) => {
        const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
        jwt.verify(token, process.env.KEY1, function(err, decoded) {
            if(err)  {
                res.json({
                    message: err
                })
            }
            
            if(decoded){
                res.json({
                    message: 'valid token'
                })
                next();
            } 
        })
    }

module.exports = verifyToken;