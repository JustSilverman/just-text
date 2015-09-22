'use strict';

var express = require('express');
var sessionsHelper = require('../helpers/sessions');
var applicationController = require('../controllers/application');
var usersController = require('../controllers/users');
var sessionsController = require('../controllers/sessions');

var router = express.Router();

router.get('/', applicationController.root);

router.get('/users/new', usersController.newUser);
router.get('/users/:id', sessionsHelper.requireLogin, usersController.getUser);
router.post('/users', usersController.createUser);

router.get('/login', sessionsController.loginPage);
router.post('/login', sessionsController.loginUser);
router.get('/logout', sessionsController.logout);

module.exports = router;
