const express = require('express');

const profile = express.Router();
const account = require('../controller/AccountController');
const Middleware = require('../utils/middlewares');


profile.route('/:id')
  .all(Middleware.upload)
  .get(account.user_get)
  .put(account.user_update_setting)
  .post(account.user_update_profile);

module.exports = profile;
