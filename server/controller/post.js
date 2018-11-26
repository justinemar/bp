/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const cloudinary = require('cloudinary');
const DataUri = require('datauri');
const Post = require('../models/post');
const Photo = require('../models/photo');

/* LOAD CONFIG */
require('../helpers/config').cloudinary;


module.exports = {
    new_post:
        (req, res) => {
            const uri = new DataUri();
            const images = [];
            const promises = [];
            const post = new Post({
                post_description: req.body.description,
                post_by: req.body.id,
                photoURL: req.body.id,
                post_comments: [],
            });

            if (req.files.length <= 0) {
                post.save((err) => {
                    if (err) {
                        res.send(err);
                    }
                    post
                        .populate({ path: 'post_by', select: ['display_name', 'photo_url'] })
                        .populate({ path: 'post_comments.comment_from', select: 'photo_url display_name' },
                            (err, doc) => (
                                res.json({
                                    message: 'Success', type: 'success', code: 200, data: doc,
                                })
                            ));
                });
            } else {
                for (const key in req.files) {
                    const obj = req.files[key];
                    uri.format('.png', obj.buffer);
                    const uriContent = uri.content;
                    promises.push(new Promise((resolve, reject) => {
                        cloudinary.v2.uploader.upload(uriContent, (error, result) => {
                            if (error) {
                                reject(error);
                            }
                            if (result.url) {
                                images.push(result.url);
                                resolve(images);
                            }
                        });
                    }));
                }

                Promise.all(promises)
                    .then((imagesArr) => {
                        if (imagesArr) {
                            const photo = new Photo({
                                imageArray: images,
                                uploader: req.body.id,
                            });

                            photo.save().then((image) => {
                                if (image) {
                                    post.post_img = image.id;
                                    post.save((err) => {
                                        if (err) {
                                            res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                                        }
                                        post
                                            .populate({ path: 'post_by', select: ['display_name', 'photo_url'] })
                                            .populate({ path: 'post_comments.comment_from', select: 'photo_url display_name' })
                                            .populate({ path: 'post_img', select: 'imageArray' },
                                                (err, doc) => {
                                                    if (err) { console.log(err); }
                                                    return (
                                                        res.json({
                                                            message: 'Success', type: 'success', code: 200, data: doc,
                                                        })
                                                    );
                                                });
                                    });
                                }
                            });
                        }
                    })
                    .catch((err) => { console.log('caught', err); });
            }
    },

    get_post:
        (req, res) => {
            const page = parseInt(req.query.page, 10);
            const limit = parseInt(req.query.limit, 10);
            Post.find({}).sort({ post_date: -1 }).skip(page).limit(limit)
                .populate({ path: 'post_by', select: ['display_name', 'photo_url'] })
                .populate({ path: 'post_comments.comment_from', select: 'photo_url display_name' })
                .populate({ path: 'post_img', select: 'imageArray' })
                .exec((err, post) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                    }
                    res.json({
                        message: 'Success', type: 'success', code: 200, data: post,
                    });
                });
        },

    delete_post:
        (req, res) => {
            Post.findOneAndDelete({ _id: req.params.id })
                .exec()
                .then((post) => {
                    if (post && post.post_img !== undefined) {
                        return post;
                    }
                    return (
                        res.json({
                            data: post, code: 200, type: 'success', message: 'Post deleted',
                        })
                    );
                })
                .then((post) => {
                    Photo.findOneAndDelete({ _id: post.post_img },
                        (err, photo) => {
                            if (err) {
                                res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                            }


                            if (photo) {
                                const result = new Promise((resolve) => {
                                    const ids = [];
                                    photo.imageArray.forEach((imageID) => {
                                        const id = imageID.substr(imageID.lastIndexOf('/') + 1).split('.')[0];
                                        ids.push(id);
                                    });

                                    resolve(ids);
                                });


                                result.then((idArr) => {
                                    cloudinary.v2.api.delete_resources(idArr, (error, result) => {
                                        if (error) {
                                            res.json({
                                                data: post, code: 501, type: 'error', message: 'Unable to deleted',
                                            });
                                        }

                                        if (result) {
                                            return (
                                                res.json({
                                                    data: post, code: 200, type: 'success', message: 'Post deleted',
                                                })
                                            );
                                        }
                                    });
                                });
                            }
                        });
                });
        },

    get_owned_posts: (req, res) => {
        Post.find({ post_by: req.params.id }).sort({ post_date: -1 })
            .populate({ path: 'post_by', select: ['display_name', 'photo_url'] })
            .populate({ path: 'post_comments.comment_from', select: 'photo_url display_name' })
            .populate({ path: 'post_img', select: 'imageArray' })
            .exec((err, post) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                }
                res.json({
                    message: 'Success', type: 'success', code: 200, data: post,
                });
            });
    },
};
