"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const FollowSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true
    },
    following: [{
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true
    }],
    followers: [{
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true 
    }]
});

const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;