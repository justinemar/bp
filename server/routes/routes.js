const express = require('express');
const router = express.Router();
const root = require("../controller/indexController");
const account = require("../controller/accountController");
const comment = require("../controller/commentController");
const status = require("../controller/postController");
const accountMiddleWare = require("../middlewares/account");


router.get('/', root.index);

router.route('/status')
  .all(accountMiddleWare.verifyToken)
  .get(status.get)
  .post(status.new)
  .delete(status.delete);

router.get('/profile/users/:user', account.getUser);

router.post('/register', accountMiddleWare.checkUser, account.register);

router.post('/login', account.login);

router.post('/comment', accountMiddleWare.verifyToken, comment.new);

module.exports = router;