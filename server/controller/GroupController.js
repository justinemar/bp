const DataUri = require('datauri');
const cloudinary = require('cloudinary');
const Group = require('../models/Group');
require('../utils/lib/config');

module.exports = {
    createGroup: (req, res) => {
        const { files: { logo }, body: { name , uid, description, public }  } = req;
        const group = new Group({
            name: name,
            owner: uid,
            description: description,
            public: public,
        });
        if (logo) {
            const { buffer } = logo[0].buffer;
            const uri = new DataUri();
            uri.format('.png', buffer);
            const uriContent = uri.content;
            cloudinary.v2.uploader.upload(uriContent, async (error, result) => {
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
        .populate({ path: 'owner', select: 'display_name' })
        .populate({ path: 'members', select: 'display_name photo_url' })
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
        Group.findOneAndUpdate({ _id: req.body.gid }, { $push: { members: req.params.uid } })
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
};
