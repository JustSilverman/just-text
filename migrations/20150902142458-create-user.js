'use strict';

var assign = require('object.assign');
var timestamps = require('../helpers/timestamps');
var initialSchema = require('../schemas/models/users_001');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(initialSchema.tableName,
      timestamps.addToSchema(initialSchema.definition(Sequelize)));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(initialSchema.tableName);
  }
};
