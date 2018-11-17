const express = require('express');

const route = express.Router();
const group = require('../controller/GroupController');
const Middleware = require('../utils/middlewares');


route.route('/')
    .get(group.getGroups)
    .post(Middleware.upload)
    .post(group.createGroup);

route.route('/:group')
    .get(group.getGroup);


route.route('/:group/wall')
    .all(Middleware.uploadArray)
    .post(group.addPost);

route.route('/members/:uid')
    // .get(group.getUserGroups)
    .post(group.joinGroup)
    .delete(group.leaveGroup);

module.exports = route;
