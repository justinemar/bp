const Account       = require('../../models/Account');
const jwt           = require("jsonwebtoken");
const multer        = require("multer");
const storage       = multer.memoryStorage();
const upload        = multer({storage}).fields([{ name: 'photo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);
const uploadArray   = multer({storage}).array('image', 12);
require('dotenv').config();

exports.setToken = (payload) => {
     return jwt.sign(payload, process.env.KEY1, {
                  expiresIn: 1800 // expires in 30 minutes
     });
}

exports.checkUser = (req, res, next) => {
        Account.findOne({$or: [ {user_email: req.body.email}, {display_name: req.body.name}]}) 
        .exec((err, user) => {
            if(err) { 
                res.status(500).json({message: 'Internal Server Error', type: 'error'});
            }
            
            if(user) {
                res.json( {
                    message : ( 
                        user.user_email === req.body.email ? "Email" : "Display Name" 
                    ) + " is already taken",
                    type: 'error'
                });
            } else {
                next();
            }
        });
    },

exports.verifyToken = (req, res, next) => {
        const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
        jwt.verify(token, process.env.KEY1, function(err, decoded) {
            if(err) {
                res.status(401).json({
                    message: "Your session has expired, please login to continue where you left off",
                    type: 'error',
                    code: 401
                });
            }
            
            if(decoded){
                next();
            } 
        });
    };
    

exports.upload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
          console.log(err);
        }
        next();
      });
};


exports.uploadArray = (req, res, next) => {
    uploadArray(req, res, function (err) {
        if(err){
            console.log(err);
        }
        next();
    });
    
};