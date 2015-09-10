'use strict';

var assign = require('object.assign');
var timestamps = require('../helpers/timestamps');
var Schema = require('../schemas/users');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(Schema.tableName,
      timestamps.addToSchema(Schema.definition(Sequelize)));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(Schema.tableName);
  }
};
