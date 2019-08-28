const Photo = require('../models/photo');


module.exports = {
    get_photos: (req, res) => {
        Photo.find({ uploader: req.params.user_id })
        .exec((err, photo) => {
            if (err) {
                console.log(err);
            }

            if (photo) {
                return res.status(200).json({
                        data: photo,
                        code: 200,
                    });
            }

            res.status(200).json({ data: [], code: 200 });
        });
    },
};
