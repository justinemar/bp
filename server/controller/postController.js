const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const Post = require("../models/UserPost");
const Account = require("../models/Account");
const DataUri = require("datauri");


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
            
            //Get buffer from files
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
                         post_by: req.body.user
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
                  res.send(posts.reverse());
              } 
          });
        },
    delete: 
        (req, res) => {
            const promises = [];
            let deletedPost;
            Post.findOne({_id: req.body.statusID},
            (error, status) => {
                if(error) throw error;
                
                if(status){
                    deletedPost = status;
                    const status_images = status.post_img;
                    if(status_images.length !== 0 || undefined){
                        status_images.forEach(i => {
                            promises.push(removeAsync(i))
                        })
                    } else {
                        Promise.resolve(status)
                    }
                }
            })
            
            
            function removeAsync(i){
                const image_id = i.substr(i.lastIndexOf('/') + 1).split('.')[0];//Get image unique ID
                return new Promise(resolve => {
                    cloudinary.v2.uploader.destroy(image_id, (result) => { //Destroy image
                        if(result){
                            resolve(result); // Resolve promise
                        }
                    }); 
                });
            }
            
            
            Promise.all(promises)
            .then(result => { // Get resolve data
                Post.deleteOne({_id: req.body.statusID}, 
                (err, result) => {
                    if(err) throw err;
                    
                    if(result){
                        console.log(deletedPost)
                        res.json({data: deletedPost})
                    }
                });
            }).catch(err => {
                throw err;
            })
        }
};



