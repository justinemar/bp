const express = require('express');
const router = express.Router();
const controller = require("../controller");
const account = require("../controller/accountController");
const accountWares = require("../middlewares/accountWares");



router.get('/', controller.root);

router.post('/register', accountWares.checkUser, account.register);

router.post('/post/new', controller.newPost);

router.post('/login', account.login);

module.exports = router;