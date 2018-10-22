const cloudinary = require("cloudinary");
const Post = require("../models/UserPost");
const Photo = require("../models/Photo");
const DataUri = require("datauri");

/* LOAD CONFIG */
require("../utils/lib/config").cloudinary;


module.exports = {
    new_post: 
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

                    const photo = new Photo({
                        imageArray: images,
                        uploader: req.body.id
                    })

                    photo.save((err, image) => {
                        const post = new Post({
                            post_img: image.id,
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
                           post
                           .populate({path: 'post_by', select: ['display_name', 'photo_url']})
                           .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
                           .populate({path: 'post_img', select: 'imageArray'},
                                (err, doc) => {
                                    res.json({message: 'Success', type: 'success', code: 200, data: doc});
                                })
                        });
                    })
                })
              .catch(err => {
                  console.log(err);
              });
        },
        
    get_post: 
        (req, res) => {
             Post.find({})
             .populate({path: 'post_by', select: ['display_name', 'photo_url']})
             .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
             .populate({path: 'post_img', select: 'imageArray'})
             .exec((err, post) => {
                 if(err) {
                     console.log(err)
                 }
                 res.json({message: 'Success', type: 'success', code: 200, data: post.reverse()});
              });
        },
    update_post: 
        (req, res) => {
            
        },
    
    delete_post: 
        (req, res) => {
            Post.findOneAndDelete({_id: req.params.id},
                (err, post) => {

                    Photo.findOneAndDelete({_id: post.post_img},
                        (err, photo) => {
                            photo.imageArray.forEach(i => {
                                const image_id = i.substr(i.lastIndexOf('/') + 1).split('.')[0];
                                cloudinary.v2.uploader.destroy(image_id, function(error,result) {
                                    if(error){
                                        reject(error);
                                    }
                                    
                                    if(result){
                                        res.json({data: post, code: 200, type: 'success', message: 'Post deleted'});
                                    }
                                });
                            })
                         })
                })
        },
        
    get_owned_posts: (req, res) => {
        Post.find({post_by: req.params.id})
         .populate({path: 'post_by', select: ['display_name', 'photo_url']})
         .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
         .populate({path: 'post_img', select: 'imageArray'})
         .exec((err, post) => {
             if(err) {
                 console.log(err)
             }
                res.json({message: 'Success', type: 'success', code: 200, data: post.reverse()});
         }); 
    },
    
   get_owned_images: (req, res) => {

   }
};



