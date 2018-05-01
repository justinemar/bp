const Account       = require("../models/Account");
const UserPost      = require("../models/UserPost");
const utils      = require("../utils/utils");
const jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config()


module.exports = {
    
    user_register: (req, res) => {
        const member = new Account({
            user_email: req.body.email,
            password: req.body.password,
            display_name: req.body.name,
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
    
    user_login: (req, res) => {
        Account.findOne({user_email: req.body.email})
        .select('+password')
        .exec(function(err, user){
            if(err) throw err;

            if(user){
                const payload = {
                    displayName: user.display_name,
                    id: user._id,
                    info: user.user_email
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

    user_get: (req, res) => {
        Account.findOne({_id: req.params.user}, 
            (err, user) => {
                if(err) throw err;
    
                if(user){
                    res.send(user)
                }
            })
        },
    
    user_update: (req, res) => {
        const email = req.body.originalKeyValue.email;
        const name = req.body.originalKeyValue.name;
        if(email){
            Account.findByIdAndUpdate({_id: req.body.user_id}, {$set: {user_email: req.body.entry}})
            .exec((err, user) => {
                if(err){
                    throw err;
                }
                
                if(user){
                    var payload = {
                        displayName: user.display_name,
                        id: user._id,
                        info: req.body.entry
                    };
                     res.json({
                        message: 'Account Updated!', 
                        token: utils.setToken(payload),
                        code: 200
                    });
                }
            })
            
        } else if(name) {
            Account.findByIdAndUpdate({_id: req.body.user_id}, {$set: {display_name:req.body.entry}})
            .exec((err, user) => {
                if(err){
                    throw err;
                }
                
                
                if(user){
                    var payload = {
                        displayName: req.body.entry,
                        id: user._id,
                        info: user.user_email
                    };
                    res.json({
                        message: 'Account Updated!', 
                        token: utils.setToken(payload), 
                        code: 200
                    });
                } else {
                    res.json({
                        message: 'Unknown error has occured.',
                        code: 501
                    });
                }
            });
        } 
    }
    
};
