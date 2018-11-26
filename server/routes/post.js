const express = require('express');

const router = express.Router();
const post = require('../controller/post');
const middleware = require('../middlewares');


router.route('/')
  .all(middleware.uploadArray)
  .get(post.get_post)
  .post(post.new_post);

  router.route('/:id')
  .all(middleware.uploadArray)
  .get(post.get_owned_posts)
  .delete(post.delete_post);
  // .patch(post.update_post)

module.exports = router;
