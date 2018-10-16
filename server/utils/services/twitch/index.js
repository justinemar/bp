const express = require('express');
const twitch = express.Router();
const TwitchControl = require('./TwitchController.js')
const helper = require("../../lib/account.js");

twitch.route('/')
  .all(helper.verifyToken)
  .get(TwitchControl.getStreams)



  module.exports = twitch;