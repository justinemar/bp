const express = require('express');
const router = express.Router();
const root = require("../controller/indexController");
const account = require("../controller/accountController");
const comment = require("../controller/postCommentController");
const status = require("../controller/postController");
const accountMiddleWare = require("../middlewares/account");


router.get('/', root.index);

router.route('/status')
  .all(accountMiddleWare.verifyToken)
  .get(status.get)
  .post(status.new)
  .delete(status.delete);

router.get('/profile/users/:user', account.user_get);

router.put('/profile/users/:user', account.user_update);

router.post('/register', accountMiddleWare.checkUser, account.user_register);

router.post('/login', account.user_login);

router.post('/comment', accountMiddleWare.verifyToken, comment.new);

module.exports = router;