'use strict';

var schemaFetcher = require('../schemas/schema_fetcher');
var rotary = require('../helpers/rotary');
var CURRENT_VERSION = '002';

module.exports = function(sequelize, DataTypes) {
  var userSchema = schemaFetcher.fetch('users', CURRENT_VERSION);

  return sequelize.define(userSchema.name, userSchema.definition(DataTypes), {
    tableName: userSchema.tableName,
    hooks: {
      beforeValidate: function(user, options) {
        user.phoneNumber = rotary.parse(user.phoneNumber);
      }
    },
    instanceMethods: {
      validateEmail: function() {
        return this.updateAttributes({emailValidated: true});
      },

      validatePhoneNumber: function() {
        return this.updateAttributes({phoneNumberValidated: true});
      }
    }
  });
};
