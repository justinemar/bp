const express = require('express');

const photo = express.Router();
const photoController = require('../controller/PhotoController');
const Middleware = require('../utils/middlewares');


photo.route('/user/:user_id')
    .get(photoController.get_photos);

photo.route('/:photo_id');
// .get(photoController.user_get)


module.exports = photo;
