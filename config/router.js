'use strict';

var express = require('express');
var router = express.Router();

var applicationController = require('../controllers/application');

router.get('/', applicationController.root);

module.exports = router;
