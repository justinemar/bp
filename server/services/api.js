const express = require('express');

const routes = express.Router();
const twitch = require('./twitch-api/');


routes.use('/stream', twitch);


module.exports = routes;
