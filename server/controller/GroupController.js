/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const DataUri = require('datauri');
const cloudinary = require('cloudinary');
const Group = require('../models/Group');
const Post = require('../models/UserPost');
const Photo = require('../models/Photo');

require('../utils/lib/config');

module.exports = {
    createGroup: (req, res) => {
        const { files: { logo }, body: { name, uid, description, public } } = req;
        const group = new Group({
            name,
            description,
            public,
            members: {
                identity: uid,
                role: 'Owner'
            }
        });
        if (logo) {
            const { buffer } = logo[0].buffer;
            const uri = new DataUri();
            uri.format('.png', buffer);
            const uriContent = uri.content;
            cloudinary.v2.uploader.upload(uriContent, (error, result) => {
                if (error) {
                    return res.status(500).json({ error, message: 'Internal Server Error', type: 'error' });
                }

                if (result) {
                    group.logo = result.url;
                    group.save((err, data) => {
                        if (err) {
                            return res.status(500).json({ error, message: 'Internal Server Error', type: 'error' });
                        }

                        if (data) {
                            return res.status(200).json(data);
                        }
                    });
                }
            });
        } else {
            group.save((err, data) => {
                if (err) {
                    return (
                        res.status(500).json({ err, message: 'Internal Server Error', type: 'error' })
                    );
                }

                if (data) {
                    return (
                        res.status(200).json(data)
                    );
                }
            });
        }
    },

    getGroups: (req, res) => {
        console.log('hello');
        Group.find({})
            .populate({ path: 'members.identity', select: 'display_name photo_url' })
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error', err });
                }

                if (data) {
                    res.json(data);
                }
            });
    },

    getGroup: (req, res) => {
        Group.find({ name: req.params.group })
            .populate({ path: 'members.identity', select: 'display_name photo_url online' })
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                }

                if (data) {
                    res.json(data);
                }
            });
    },

    joinGroup: (req, res) => {
        Group.findOneAndUpdate({ _id: req.body.gid }, { $push: { members: { identity: req.params.uid } } })
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                }


                if (data) {
                    res.status(200).json(data);
                }
            });
    },

    leaveGroup: (req, res) => {
        console.log(req.body.gid, req.params.uid);
        Group.findOneAndUpdate({ _id: req.body.gid }, { $pull: { members: req.params.uid } })
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                }


                if (data) {
                    res.status(200).json(data);
                }
            });
    },

    addPost: (req, res) => {
        const images = [];
        const promises = [];
        const uri = new DataUri();
        const post = new Post({
            post_description: req.body.description,
            post_by: req.body.id,
            post_comments: [],
            group_id: req.params.group
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
         } 
         else {
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
                            resolve(result.url)
                        }
                    });
                }));
            }

            Promise.all(promises)
                .then(data => {
                    if (data) {
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
                .catch(err => console.log(err))
        }
    }
};
