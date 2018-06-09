const express = require('express');
const profile = express.Router();
const account = require("../controller/AccountController");
const helper = require("../utils/lib/account");


profile.route('/:id')
  .all(helper.verifyToken)
  .all(helper.upload)
  .get(account.user_get)
  .put(account.user_update_setting)  
  .post(account.user_update_profile)



module.exports = profile;