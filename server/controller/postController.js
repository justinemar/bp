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
    new: function(req, res) {
        const uri = new DataUri();
        const copy = [];
        const promises = [];
        const images = [];
        let id = 0;
        req.files.map(i => {
              copy[`id${id}`] = i;
              id++
        })
        
        for (var key in copy) {
          const obj = copy[key];
          uri.format('.png', obj.buffer)
          let uriContent = uri.content;
          promises.push(uploadAsync(uriContent));
        }
        
        
        function uploadAsync(buffer){
            return new Promise(resolve => {
            cloudinary.uploader.upload(buffer, function(result) {
                        if(result.url){
                            images.push(result.url);
                            resolve(result.url)
                        }
                    });
                });
            }
        
        
        Promise.all(promises)
          .then(results => {
                const post = new Post({
                     post_id: new mongoose.Types.ObjectId(),
                     post_img: images,
                     post_description: req.body.description
                 });
                post.save(function(err) {
                     if(err) {
                        res.send(err);
                     } else {
                        res.json({message: 'Success', type: 'success'})
                     }
                 });
          }).catch(err => {
              console.log(err)
          })
    }
};