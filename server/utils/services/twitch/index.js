const express = require('express');

const twitch = express.Router();
const TwitchControl = require('./TwitchController.js');
const Middleware = require('../../middlewares');


twitch.route('/')
  .get(TwitchControl.getStreams);


  module.exports = twitch;
