'use strict';

var helper = require('../helpers/schema');
var initialSchema = require('../schemas/models/phone_number_confirmations_001');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var withTimestamps = helper.addTimestampsToSchema(initialSchema.definition(Sequelize));
    var withoutVirtualProps = helper.removeVirtual(withTimestamps);
    return queryInterface.createTable(initialSchema.tableName, withoutVirtualProps);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(initialSchema.tableName);
  }
};
