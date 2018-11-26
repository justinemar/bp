const express = require('express');

const router = express.Router();
const user = require('../controller/user');
const middleware = require('../middlewares');


router.route('/')
    .post(middleware.checkUser)
    .post(user.register)
    .post(middleware.sendVerification);


router.route('/verify/:token')
    .get(middleware.verifyEmail);

router.route('/resend/:email')
    .get(middleware.sendVerification);


module.exports = router;
