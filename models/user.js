'use strict';

var bcrypt = require('bcrypt-as-promised');
var schemaFetcher = require('../schemas/schema_fetcher');
var rotary = require('../helpers/rotary');
var CURRENT_VERSION = '001';
var helper = require('../helpers/model');
var DEFAULT_SALT_FACTOR = 10;

function getDefaultValues(definitions) {
  return Object.keys(definitions).reduce(function(memo, currKey) {
    var defaultValue = definitions[currKey].defaultValue;

    if (defaultValue !== undefined) {
      memo[currKey] = defaultValue;
    }
    return memo;
  }, {});

}

module.exports = function(sequelize, DataTypes) {
  var userSchema = schemaFetcher.fetch('users', CURRENT_VERSION);
  var definitions = userSchema.definition(DataTypes);

  var User = sequelize.define(userSchema.name, definitions, {
    tableName: userSchema.tableName,
    instanceMethods: {
      getDefaultValues: function() {
        return helper.getDefaultValues(definitions);
      },

      setDefaults: function() {
        helper.setDefaults(this, this.getDefaultValues());
      },

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
      associate: function(models) {
        User.hasMany(models.PhoneNumberConfirmation, { foreignKey: 'userId' });
      },
      authenticate: function(email, passwordAttempt) {
        return User.findOne({ email: email })
          .then(function(user) {
            if (!user) {
              return sequelize.Promise.reject(new Error('invalid'));
            }

            return bcrypt.compare(passwordAttempt, user.passwordHash)
              .then(function(valid) {
                if (!valid) {
                  return sequelize.Promise.reject(new Error('invalid'));
                }

                return sequelize.Promise.resolve(user);
              });
          });

      },
      hashPassword: function(password) {
        if (!password) {
          return sequelize.Promise.reject(new Error('Invalid password of ' + password + ' passed to hashPassword.'));
        }

        return bcrypt.hash(password, DEFAULT_SALT_FACTOR);
      }
    }
  });

  User.addHook('beforeValidate', function(user) {
    user.setDefaults();
  });

  User.addHook('beforeValidate', function(user) {
    user.phoneNumber = rotary.parse(user.phoneNumber);
  });

  User.addHook('afterValidate', function(user) {
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
