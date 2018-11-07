const express = require('express');
const photo = express.Router();
const photoController = require("../controller/PhotoController");
const Middleware = require("../utils/middlewares");


photo.route('/user/:user_id')
    .all(Middleware.verifyToken)
    .get(photoController.get_photos)

photo.route('/:photo_id')
    .all(Middleware.verifyToken)
// .get(photoController.user_get)


module.exports = photo;