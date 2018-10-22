"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PhotoSchema = new Schema({
    imageArray:{
        type: Array,
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    uploader: {
        type: Schema.Types.ObjectId, ref: 'Account',
        required: true
    }
});


const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;

