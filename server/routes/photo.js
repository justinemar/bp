const express = require('express');

const router = express.Router();
const photo = require('../controller/photo');


router.route('/user/:user_id')
    .get(photo.get_photos);

router.route('/:photo_id');


module.exports = router;
