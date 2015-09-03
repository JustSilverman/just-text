'use strict';

var Sequelize = require('sequelize');
var env       = require('../config/settings').environment;
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var db = {
  sequelize: sequelize,
  Sequelize: Sequelize
}

module.exports = db;
