'use strict';

var express = require('express');
var router = express.Router();
var sessionsHelper = require('../helpers/sessions');

var applicationController = require('../controllers/application');
var usersController = require('../controllers/users');

router.get('/', applicationController.root);

router.get('/users/new', usersController.newUser);
router.get('/users/:id', sessionsHelper.requireLogin, usersController.getUser);
router.post('/users', usersController.getUser);
module.exports = router;
