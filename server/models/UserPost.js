"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserPostSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    post_img: {
        type: Array,
        required: true
    },
    post_description: {
        type: String,
    },
    post_by: {
        type: String,
        required: true
    },
    post_date: {
        type: Date, 
        default: Date.now 
    }
});


const Post = mongoose.model('UserPost', UserPostSchema);

module.exports = Post;

