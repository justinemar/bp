const Account       = require("../models/Account");
const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config()

module.exports = {
    
    register: (req, res) => {
        const member = new Account({
            user_email: req.body.email,
            password: req.body.password,
            registration: Date.now(),
        })
        member.save(function(err, data) {
            if(err) {
                console.log(err)
                res.status(500).json({message: 'Internal Server Error', type: 'error'})
            };
            
            if(data){
                res.json({
                    message: 'Account successfully created.',
                    type: 'success'
                })
            } 
        })

    },
    
    login: (req, res) => {
        Account.findOne({user_email: req.body.email})
        .select('+password')
        .exec(function(err, user){
            if(err) throw err;

            if(user){
                var payload = {
                    info: user.user_email || user.displayName,
                    id: user._id
                }
                user.comparePassword(req.body.password, function(err, match) {
                    if(err) throw err;
                    
                    if(match){
                        var token = jwt.sign(payload, process.env.KEY1, {
                          expiresIn: 1800 // expires in 30 minutes
                        });
                        
                        res.json({
                            message: 'Login successfully',
                            type: 'success',
                            token: token
                        })
                    } else {
                        res.json({
                            message: 'Invalid email or password',
                            type: 'error'
                        })
                    }
                })
            
            } else {
                res.json({
                    message: "We can't find an account associated with this email",
                    type: 'error'
                })
            }
        })
    },

    getUser: (req, res) => {
        Account.findOne({_id: req.params.user}, 
            (err, user) => {
                if(err) throw err;
    
                if(user){
                    res.send(user)
                }
            })
        }
    
}
