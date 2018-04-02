"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserPostSchema = new Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    post_img: {
        type: String,
        required: true
    },
    post_description: {
        type: String,
    }
});


const Post = mongoose.model('UserPost', UserPostSchema);

module.exports = Post;

