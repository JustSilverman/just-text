'use strict';

var fs        = require('fs');
var path      = require('path');
var assign    = require('object.assign');
var basename  = path.basename(module.filename);
var db        = require('../config/db');
var Models    = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = db.sequelize['import'](path.join(__dirname, file));
    Models[model.name] = model;
  });

Object.keys(Models).forEach(function(modelName) {
  if (Models[modelName].associate) {
    Models[modelName].associate(Models);
  }
});

assign(Models, db);

module.exports = Models;
