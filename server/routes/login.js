const express = require('express');
const login = express.Router();
const account = require("../controller/AccountController");
const Middleware = require("../utils/middlewares");



login.route('/')
    .post(Middleware.checkUserStatus) 
    .post(account.user_login)


    module.exports = login;