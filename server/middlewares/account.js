const Account = require('../models/Account');
const jwt = require("jsonwebtoken");
require('dotenv').config()


const accountMiddlewares = {
    checkUser: function(req, res, next){
        const filter = req.body.email || req.body.user_id
        Account.findOne({user_email: filter}, function(err, user) {
            if(err) { 
                console.error(err)
                res.status(500).json({message: 'Internal Server Error'})
            };
            
            if(user && req.body.email) {
                res.json({
                    message: 'Account email address already exists!',
                    type: 'error'
                })
            } else if(user && req.body.user_id) {
                res.send(user)
            
            } else {
                next();
            }
        })
    },

    verifyToken: (req, res, next) => {
        const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
        jwt.verify(token, process.env.KEY1, function(err, decoded) {
            if(err) {
                res.status(401).json({
                    message: "Your session has expired, please login to continue where you left off",
                    type: 'error',
                    code: 401
                })
            }
            
            if(decoded){
                next();
            } 
        })
    }

}

module.exports = accountMiddlewares;