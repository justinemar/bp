const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const Post = require("../models/UserPost");
const Account = require("../models/Account");
const DataUri = require("datauri");
const verifyToken = require("../middlewares/verifyWare");

require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


module.exports = {
    new: 
        (req, res) => {
            const uri = new DataUri();
            const promises = [];
            const images = [];
            
            //Get buffer from files and transform
            for(var key in req.files){ 
              const obj = req.files[key];
              uri.format('.png', obj.buffer);
              let uriContent = uri.content;
              promises.push(uploadAsync(uriContent)); //upload each image
            }
            
            //Init upload
            function uploadAsync(buffer){
                return new Promise(resolve => {
                cloudinary.uploader.upload(buffer, function(result) {
                            if(result.url){
                                images.push(result.url);
                                resolve(result.url);
                            }
                        });
                    });
                }
            
        
            Promise.all(promises)
              .then(results => {
                  // Init post model
                    const post = new Post({
                         user_id: req.body.id,
                         post_img: images,
                         post_description: req.body.description,
                         post_by: req.body.user,
                         
                     });
                  // Save data
                    post.save(function(err) {
                         if(err) {
                            res.send(err);
                         } else {
                            res.json({message: 'Success', type: 'success', code: 200, data: post});
                         }
                     });
              }).catch(err => {
                  console.log(err);
              });
        },
        
    get: 
        (req, res) => {
          Post.find({}, (err, posts) => {
              if(err) throw err;
              
              if(posts){
                  res.send(posts);
              } 
          });
        }
};



