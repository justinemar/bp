const routes = require('express').Router();
const postRouter = require('./post');
const profileRouter = require('./profile');
const registerRouter = require('./register');
const photoRouter = require('./photo');
const loginRouter = require('./login');
const groupRouter = require('./group');
const commentRouter = require('./comment');

routes.use('/login', loginRouter)
      .use('/register', registerRouter)
      .use('/profile', profileRouter)
      .use('/post', postRouter)
      .use('/photos', photoRouter)
      .use('/comment', commentRouter)
      .use('/groups', groupRouter);


module.exports = routes;
