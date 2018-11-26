const express = require('express');

const router = express.Router();
const user = require('../controller/user');
const middleware = require('../middlewares');


router.route('/:id')
  .all(middleware.upload)
  .get(user.getUser)
  .put(user.updateSetting)
  .post(user.updateProfile);

module.exports = router;
