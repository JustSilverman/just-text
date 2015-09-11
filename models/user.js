'use strict';

var bcrypt = require('bcryptjs');
var schemaFetcher = require('../schemas/schema_fetcher');
var rotary = require('../helpers/rotary');
var CURRENT_VERSION = '001';
var DEFAULT_SALT_FACTOR = 10;

module.exports = function(sequelize, DataTypes) {
  var userSchema = schemaFetcher.fetch('users', CURRENT_VERSION);

  return sequelize.define(userSchema.name, userSchema.definition(DataTypes), {
    tableName: userSchema.tableName,
    hooks: {
      beforeValidate: function(user) {
        user.phoneNumber = rotary.parse(user.phoneNumber);
      },
      afterValidate: function(user) {
        user.email = user.email.toLowerCase();
      }
    },
    instanceMethods: {
      validateEmail: function() {
        return this.updateAttributes({emailValidated: true});
      },

      validatePhoneNumber: function() {
        return this.updateAttributes({phoneNumberValidated: true});
      }
    },
    classMethods: {
      hashPassword: function(password, cb) {
        if (!password) {
          return cb(new Error('Invalid password of ' + password + ' passed to hashPassword.'));
        }

        bcrypt.genSalt(DEFAULT_SALT_FACTOR, function(err, salt) {
          if (err) {
            return cb(err);
          }

          bcrypt.hash(password, salt, cb);
        });
      }
    }
  });
};
