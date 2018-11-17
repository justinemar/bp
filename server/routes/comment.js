
const express = require('express');

const router = express.Router();
const comment = require('../controller/CommentController');
const Middleware = require('../utils/middlewares');


router.post('/', comment.new);

module.exports = router;
