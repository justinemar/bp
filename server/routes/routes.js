const express = require('express');
const router = express.Router();
const root = require("../controller/indexController");
const account = require("../controller/accountController");
const comment = require("../controller/commentController");
const status = require("../controller/postController");
const accountWares = require("../middlewares/accountWares");
const verifyToken = require("../middlewares/verifyWare");

router.get('/', root.index);

router.route('/status')
  .all(verifyToken)
  .get(status.get)
  .post(status.new);
  
router.post('/register', accountWares.checkUser, account.register);

router.post('/login', account.login);

router.post('/comment', verifyToken, comment.new);

module.exports = router;