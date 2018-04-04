const express = require('express');
const router = express.Router();
const root = require("../controller/indexController");
const account = require("../controller/accountController");
const comment = require("../controller/commentController");
const post = require("../controller/postController");
const accountWares = require("../middlewares/accountWares");



router.get('/', root.index);

router.post('/register', accountWares.checkUser, account.register);

router.post('/login', account.login);

router.post('/post', post.new);

router.post('/comment', comment.new);

module.exports = router;