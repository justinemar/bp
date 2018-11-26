const express = require('express');

const router = express.Router();
const twitch = require('./twitch');


router.route('/')
.get(twitch.getStreams);


module.exports = router;
