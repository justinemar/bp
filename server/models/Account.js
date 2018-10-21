"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const AccountSchema = new Schema({
    user_email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    display_name: {
        type: String,
        required: true,
        unique: true
    },
    photo_url: {
        // Doesn't need to be validated as URL 
        default: 'http://res.cloudinary.com/dhwgznjct/image/upload/v1525771237/default_hprinl.png', 
        type: String
    },
    cover_url: {
        default: 'http://res.cloudinary.com/dhwgznjct/image/upload/v1525850539/space-travel-2368412_1280_lajb9f.jpg',
        type: String
    },
    registration: {
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    }
});


AccountSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;

