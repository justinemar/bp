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
        type: Array,
        required: true
    },
    post_description: {
        type: String,
    },
    post_by: {
        type: String,
        required: true
    }
});


const Post = mongoose.model('UserPost', UserPostSchema);

module.exports = Post;

