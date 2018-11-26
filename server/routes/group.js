const express = require('express');

const router = express.Router();
const group = require('../controller/group');
const middleware = require('../middlewares');


router.route('/')
    .get(group.getGroups)
    .post(middleware.upload)
    .post(group.createGroup);

router.route('/:group')
    .get(group.getGroup);


router.route('/:group/wall')
    .all(middleware.uploadArray)
    .post(group.addPost);

router.route('/members/:uid')
    // .get(group.getUserGroups)
    .post(group.joinGroup)
    .delete(group.leaveGroup);

module.exports = router;
