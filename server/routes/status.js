const express = require('express');
const status = express.Router();
const post = require("../controller/PostController");
const helper = require("../utils/lib/account");



status.route('/')
  .all(helper.verifyToken)
  .all(helper.uploadArray)
  .get(post.get_post)
  .post(post.new_post)

status.route('/:id')
  .all(helper.verifyToken)
  .all(helper.uploadArray)
  .get(post.get_owned_posts)
  .delete(post.delete_post)
  .patch(post.update_post)
  
  
module.exports = status;