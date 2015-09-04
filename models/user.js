'use strict';

var Schema = require('../schemas/users');
var rotary = require('../helpers/rotary');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(Schema.name, Schema.definition(DataTypes), {
    tableName: Schema.tableName,
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

  return User;
};
