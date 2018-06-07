const cloudinary = require("cloudinary");
const Post = require("../models/UserPost");
const DataUri = require("datauri");

/* LOAD CONFIG */
require("../utils/lib/config");


module.exports = {
    post_new: 
    /* Cloudinary doesn't support multiple resource upload on a single POST request */
        (req, res) => {
            
            const uri = new DataUri();
            const promises = [];
            const images = [];
            //Get buffer from files
            for(let key in req.files){ 
              const obj = req.files[key];
              uri.format('.png', obj.buffer);
              let uriContent = uri.content;
              promises.push(uploadAsync(uriContent)); //upload each image
            }
            //Init upload
            function uploadAsync(buffer){
                return new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload(buffer, function(error, result) {
                        if(error){
                            reject(error);
                        }
                        if(result.url){
                            images.push(result.url);
                            resolve(images);
                        }
                    });
                });
            }
            
        
            Promise.all(promises)
            .then(results => {
                  // Init post model
                  console.log('test1')
                    const post = new Post({
                         post_img: images,
                         post_description: req.body.description,
                         post_by: req.body.id,
                         photoURL: req.body.id,
                         post_comments: []
                     });
                  // Save data
                    post.save(function(err) {
                         if(err) {
                            res.send(err);
                         } 
                        
                        // Transform instance to plain JS Object for modification, instead of populate (freeing extra query)
                        const leanObject = post.toObject(); 
                        // Modifications
                        leanObject['post_by'] = {
                            _id: leanObject['post_by'],
                            display_name: req.body.user, // Add current user display name
                            photo_url: req.body.user_photo // Add current user photo
                        };
                        
                        res.json({message: 'Success', type: 'success', code: 200, data: leanObject});
                     });
              })
              .catch(err => {
                  console.log(err);
              });
        },
        
    post_get: 
        (req, res) => {
             Post.find({})
             .populate({path: 'post_by', select: ['display_name', 'photo_url']})
             .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
             .exec((err, post) => {
                 if(err) {
                     console.log(err)
                 }
                 res.json({message: 'Success', type: 'success', code: 200, data: post.reverse()});
              });
        },
        
    post_delete: 
        (req, res) => {
            const promises = [];
            Post.findOne({_id: req.body.statusID})
            .exec((error, status) => {
                if(error) throw error;
                
                if(status){
                    const status_images = status.post_img;
                    if(status_images.length !== 0 || undefined){
                        status_images.forEach(i => {
                            promises.push(removeAsync(status, i));
                        });
                    } else {
                        promises.push(Promise.resolve(status));
                    }
                }
                
                
                function removeAsync(status, i){
                    const image_id = i.substr(i.lastIndexOf('/') + 1).split('.')[0];//Get image unique ID
                    return new Promise((resolve, reject) => {
                        cloudinary.v2.uploader.destroy(image_id, function(error,result) {
                            if(error){
                                reject(error);
                            }
                            
                            if(result){
                                resolve(status); // Resolve promise
                            }
                        });
                    });
                }
                
                Promise.all(promises)
                .then(post => { // Get resolve data
                    Post.deleteOne({_id: req.body.statusID}, 
                    (err, result) => {
                        if(err) throw err;
                        
                        if(result){
                            res.json({data: post, code: 200, type: 'success', message: 'Post deleted'});
                        }
                    });
                })
                .catch(err => {
                    throw err;
                });
            });
        },
        
    post_user_owned: (req, res) => {
        Post.find({post_by: req.params.user})
         .populate({path: 'post_by', select: ['display_name', 'photo_url']})
         .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
         .exec((err, post) => {
             if(err) {
                 console.log(err)
             }
                res.json({message: 'Success', type: 'success', code: 200, data: post.reverse()});
         }); 
    }
};



