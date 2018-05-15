const express = require('express');
const router = express.Router();
const root = require("../controller/IndexController");
const account = require("../controller/AccountController");
const comment = require("../controller/CommentController");
const status = require("../controller/PostController");
const helper = require("../utils/lib/account");


router.get('/', root.index);

router.route('/status')
  .all(helper.verifyToken)
  .get(status.get)
  .post(status.new)
  .delete(status.delete);

router.get('/users/:user', account.user_get);
router.put('/users/:user', account.user_update);
router.get('/profile/update_photo', account.user_update_photo);

router.post('/register', helper.checkUser, account.user_register);

router.post('/login', account.user_login);

router.post('/comment', helper.verifyToken, comment.new);

module.exports = router;