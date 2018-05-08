"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserPostSchema = new Schema({
    post_img: {
        type: Array,
        required: true
    },
    post_description: {
        type: String,
    },
    post_by: {
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true
    },
    photoURL: {
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true
    },
    post_date: {
        type: Date, 
        default: Date.now 
    },
    post_comments: [{
        comment_text: String,
        comment_from: {
            type: Schema.Types.ObjectId, ref: 'Account',
            ref: 'Account'
        },
        comment_posted: {
            type: Date,
            default: Date.now
        }
    }]
});


const Post = mongoose.model('UserPost', UserPostSchema);

module.exports = Post;

