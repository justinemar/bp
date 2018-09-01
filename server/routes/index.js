const express = require('express');
const router = express.Router();
const root = require("../controller/IndexController");
const account = require("../controller/AccountController");
const comment = require("../controller/CommentController");
const helper = require("../utils/lib/account");


router.get('/', root.index);

router.post('/register', helper.checkUser, account.user_register);

router.post('/login', account.user_login);

router.post('/comment', helper.verifyToken, comment.new);


module.exports = router;