'use strict';

var express = require('express');
var router = express.Router();
var sessionsHelper = require('helpers/sessions');

var applicationController = require('controllers/application');
var usersController = require('controllers/users');
var sessionsController = require('controllers/sessions');

router.get('/', applicationController.root);

router.get('/users/new', usersController.newUser);
router.get('/users/:id', sessionsHelper.requireLogin, usersController.getUser);
router.post('/users', usersController.getUser);

router.get('/login', sessionsController.loginPage);
router.post('/login', sessionsController.loginUser);
router.post('/logout', sessionsController.logout);

module.exports = router;
