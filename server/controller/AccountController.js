const Account       = require("../models/Account");
const account       = require("../utils/lib/account");
const cloudinary    = require("cloudinary");
const DataUri       = require("datauri");
require("../utils/lib/config");


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
                    photoURL: user.photo_url,
                    coverURL: user.cover_url
                };
                user.comparePassword(req.body.password, function(err, match) {
                    if(err) throw err;
                    
                    if(match){
                        res.json({
                            message: 'Login successfully',
                            type: 'success',
                            token: account.setToken(payload),
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
        Account.findOne({_id: req.params.id}, 
            (err, user) => {
                if(err) throw err;
    
                if(user){
                    res.send(user);
                }
            });
        },
    
    user_update_setting: (req, res) => {
        const email = req.body.originalKeyValue.email;
        const name = req.body.originalKeyValue.name;
        if(email){
            Account.findByIdAndUpdate({_id: req.params.id}, {$set: {user_email: req.body.entry}})
            .exec((err, user) => {
                if(err){
                    throw err;
                }
                
                if(user){
                    // Set token payload with new email
                    const payload = { 
                        displayName: user.display_name, 
                        id: user._id, email: req.body.entry, 
                        photoURL: user.photo_url,
                        coverURL: user.cover_url
                    };
                     res.json({
                        message: 'Account Updated!', 
                        token: account.setToken(payload),
                        code: 200
                    });
                }
            });
            
        } else if(name) {
            Account.findByIdAndUpdate({_id: req.params.id}, {$set: {display_name:req.body.entry}})
            .exec((err, user) => {
                if(err){
                    throw err;
                }
                
                
                if(user){
                    // Set token payload with new display_name
                    const payload = { 
                        displayName: req.body.entry, 
                        id: user._id, email: user.user_email, 
                        photoURL: user.photo_url,
                        coverURL: user.cover_url
                    };
                    res.json({
                        message: 'Account Updated!', 
                        token: account.setToken(payload), 
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
    },
    
    user_update_profile: (req, res) => {
          const uri = new DataUri();
          const asyncUpload = [];
          const keys = Object.keys(req.files);
          console.log(req.params.id)
          for(var key in req.files){
            const buffer = req.files[key][0].buffer;
            uri.format('.png', buffer);
            let uriContent = uri.content;
            const ref = key;
            asyncUpload.push(new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload(uriContent, function(error, result) {
                        if(error){
                            reject(error);
                        }
                        if(result.url){
                            resolve({ 
                                field: `${ref}_url`, 
                                data: {
                                    identifier: req.files[key][0].fieldname, 
                                    url: result.url 
                                }
                            });
                        }
                    });
                }));
           }
            
            Promise.all(asyncUpload)
            .then(results => {
                  // Save data
                  let constructObj = {};
                  for(var x=0; x < results.length; x++){
                    constructObj[results[x].field] = results[x].data.url
                  }
                  Account.findByIdAndUpdate({_id: req.params.id}, {$set: constructObj})
                  .exec((err, user) => {
                      if(err){
                          throw err;
                      }
                      if(user){
                        const payload = { 
                            displayName: user.display_name, 
                            id: user._id, 
                            email: user.user_email, 
                            photoURL: results[0] === undefined ? req.body.oldPhoto : results[0].data.url,
                            coverURL: results[1] === undefined ? req.body.oldCover : results[1].data.url
                        };
                        res.json({
                            message: 'Account Updated!', 
                            token: account.setToken(payload),
                            code: 200
                        });
                      }
                  });
              })
              .catch(err => {
                  res.json({
                      message: err,
                      code: 501
                  });
              });
    },
    
};
