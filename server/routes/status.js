const express = require('express');

const status = express.Router();
const post = require('../controller/PostController');
const Middleware = require('../utils/middlewares');


status.route('/')
  .all(Middleware.uploadArray)
  .get(post.get_post)
  .post(post.new_post);

status.route('/:id')
  .all(Middleware.uploadArray)
  .get(post.get_owned_posts)
  .delete(post.delete_post);
  // .patch(post.update_post)

module.exports = status;
