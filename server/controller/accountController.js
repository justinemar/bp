const Account       = require("../models/Account");
const utils         = require("../utils/utils");
require('dotenv').config();


module.exports = {
    
    user_register: (req, res) => {
        const member = new Account({
            user_email: req.body.email,
            password: req.body.password,
            display_name: req.body.name,
            registration: Date.now(),
        });
        member.save(function(err, data) {
            if(err) {
                res.status(500).json({message: 'Internal Server Error', type: 'error'});
            }
            
            if(data){
                res.json({
                    message: 'Account successfully created.',
                    type: 'success'
                });
            } 
        });

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
                    email: user.user_email,
                    photoURL: user.photo_url
                };
                user.comparePassword(req.body.password, function(err, match) {
                    if(err) throw err;
                    
                    if(match){
                        res.json({
                            message: 'Login successfully',
                            type: 'success',
                            token: utils.setToken(payload),
                        });
                    } else {
                        res.json({
                            message: 'Invalid email or password',
                            type: 'error'
                        });
                    }
                });
            
            } else {
                res.json({
                    message: "We can't find an account associated with this email",
                    type: 'error'
                });
            }
        });
    },

    user_get: (req, res) => {
        Account.findOne({_id: req.params.user}, 
            (err, user) => {
                if(err) throw err;
    
                if(user){
                    res.send(user);
                }
            });
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
                    // Set token payload with new email
                    const payload = { displayName: user.display_name, id: user._id, email: req.body.entry, photoURL: user.photo_url };
                     res.json({
                        message: 'Account Updated!', 
                        token: utils.setToken(payload),
                        code: 200
                    });
                }
            });
            
        } else if(name) {
            Account.findByIdAndUpdate({_id: req.body.user_id}, {$set: {display_name:req.body.entry}})
            .exec((err, user) => {
                if(err){
                    throw err;
                }
                
                
                if(user){
                    // Set token payload with new display_name
                    const payload = { displayName: req.body.entry, id: user._id, email: user.user_email };
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
