const express = require('express');
const register = express.Router();
const account = require("../controller/AccountController");
const Middleware = require("../utils/middlewares");


register.route('/')
    .post(Middleware.checkUser)
    .post(account.user_register)
    .post(Middleware.sendVerification)


register.route('/verify/:token')
    .get(Middleware.verifyEmail)

register.route('/resend/:email')
    .get(Middleware.sendVerification)


module.exports = register;