const express = require('express');
const router = express.Router();
const root = require("../controller/IndexController");
const comment = require("../controller/CommentController");
const Middleware = require("../utils/middlewares");

router.get('/', root.index);



router.post('/comment', Middleware.verifyToken, comment.new);


module.exports = router;