"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserPostSchema = new Schema({
    post_img: {
        type: Schema.Types.ObjectId, ref: 'Photo',
    },
    post_description: {
        type: String,
    },
    post_by: {
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

UserPostSchema.methods.createPost = (cb) => {
    this.save(function(err, result) {
        if (err) return cb(err);
        
        if(result){
            cb(null, this
                .populate({path: 'post_by', select: ['display_name', 'photo_url']})
                .populate({path: 'post_comments.comment_from', select: 'photo_url display_name'})
                .populate({path: 'post_img', select: 'imageArray'}));
        }

    });
}

module.exports = Post;

