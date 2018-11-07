const Group = require('../models/Group');

module.exports = {
    createGroup: (req, res) => {
        console.log(req.body.uid, req.body.name);
        const group = new Group({
            name: req.body.name,
            owner: req.body.uid,
            description: req.body.description,
            public: req.body.public,
        });

        group.save((err, data) => {
            if (err) {
                res.status(500).json({ err, message: 'Internal Server Error', type: 'error' });
            }

            if (data) {
                res.status(200).json(data);
            }
        });
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
