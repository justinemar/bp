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
        uri.format('.png', req.file.buffer)
        cloudinary.uploader.upload(uri.content, function(result) {
             const post = new Post({
                 post_id: new mongoose.Types.ObjectId(),
                 post_img: result.url,
                 post_description: req.body.description
             })
             
             post.save(function(err) {
                 if(err) {
                    res.send(err);
                 } else {
                    res.redirect('/')   
                 }
             })
        });
    }
}