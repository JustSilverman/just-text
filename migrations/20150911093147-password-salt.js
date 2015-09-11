'use strict';

var schemaFetcher = require('../schemas/schema_fetcher');
var rotary = require('../helpers/rotary');
var currentSchema = schemaFetcher.fetch('users', '002');
var newColumnName = 'passwordSalt';

module.exports = {
  up: function (queryInterface, Sequelize) {
        var columnDef = currentSchema.definition(Sequelize)[newColumnName];
        queryInterface.addColumn(
          currentSchema.tableName,
          columnDef.field,
          columnDef
        );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(newColumnName);
  }
};
