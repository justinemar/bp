const Post = require('../models/post');


module.exports = {
    new: (req, res) => {
        Post.findOne({ _id: req.body.post_id })
        .exec((err, post) => {
            if (err) {
                throw err;
            }

            if (post) {
                post.post_comments.push({ comment_from: req.body.id, comment_text: req.body.comment });
                post.save((err, data) => {
                    if (err) {
                        throw err;
                    }
                    post.populate({ path: 'post_comments.comment_from', select: 'photo_url display_name' }, (err, data) => {
                        res.send({ message: 'Comment success', code: 200, data });
                    });
                });
            }
        });
    },
};
