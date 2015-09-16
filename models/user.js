'use strict';

var bcrypt = require('bcrypt-as-promised');
var schemaFetcher = require('../schemas/schema_fetcher');
var rotary = require('../helpers/rotary');
var CURRENT_VERSION = '001';
var DEFAULT_SALT_FACTOR = 10;

module.exports = function(sequelize, DataTypes) {
  var userSchema = schemaFetcher.fetch('users', CURRENT_VERSION);

  var User = sequelize.define(userSchema.name, userSchema.definition(DataTypes), {
    tableName: userSchema.tableName,
    instanceMethods: {
      toJSON: function () {
        var values = this.get();

        delete values.passwordHash;
        return values;
      },

      validateEmail: function() {
        return this.updateAttributes({emailValidated: true});
      },

      validatePhoneNumber: function() {
        return this.updateAttributes({phoneNumberValidated: true});
      }
    },
    classMethods: {
      hashPassword: function(password) {
        if (!password) {
          return sequelize.Promise.reject(new Error('Invalid password of ' + password + ' passed to hashPassword.'));
        }

        return bcrypt.hash(password, DEFAULT_SALT_FACTOR);
      }
    }
  });

  User.addHook('beforeValidate', function(user) {
    var phoneNumber = user.phoneNumber || '';
    user.phoneNumber = rotary.parse(phoneNumber);
  });

  User.addHook('beforeValidate', function(user) {
    if (user.passwordHash) {
      return sequelize.Promise.resolve();
    }

    return User.hashPassword(user.password).then(function(hashedPassword) {
      user.passwordHash = hashedPassword;
      user.password = undefined;
    });
  });

  User.addHook('afterValidate', function(user) {
    user.email = user.email.toLowerCase();
  });

  return User;
};
