const routes = require('express').Router();
const status = require('./status');
const profile = require('./profile');
const register = require('./register');
const photo = require('./photo');
const login = require('./login');
const twitch = require('../utils/services/twitch');
const group = require('./group');
const comment = require('./comment');

routes.use('/login', login)
      .use('/register', register)
      .use('/profile', profile)
      .use('/status', status)
      .use('/photos', photo)
      .use('/stream', twitch)
      .use('/comment', comment)
      .use('/groups', group);


module.exports = routes;
