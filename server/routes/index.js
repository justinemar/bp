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
  .all(helper.uploadArray)
  .get(status.post_get)
  .post(status.post_new)
  .delete(status.post_delete);
  
router.route('/profile/:user')
  .all(helper.verifyToken)
  .all(helper.upload)
  .get(status.post_user_owned)
  .post(account.user_update_profile)
  
  
router.get('/users/:user', account.user_get);
router.put('/users/:user', account.user_update);


router.post('/register', helper.checkUser, account.user_register);

router.post('/login', account.user_login);



router.post('/comment', helper.verifyToken, comment.new);


module.exports = router;