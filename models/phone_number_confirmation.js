'use strict';

var moment = require('moment');
var Promise = require('bluebird');
var randomBytes = Promise.promisify(require('crypto').randomBytes);
var schemaFetcher = require('../schemas/schema_fetcher');
var helper = require('../helpers/model');
var CURRENT_VERSION = '001';

module.exports = function(sequelize, DataTypes) {
  var schema = schemaFetcher.fetch('phone_number_confirmations', CURRENT_VERSION);
  var definitions = schema.definition(DataTypes);

  var PhoneNumberConfirmation = sequelize.define(schema.name, definitions, {
    tableName: schema.tableName,
    instanceMethods: {
      getDefaultValues: function() {
        return helper.getDefaultValues(definitions);
      },

      setDefaults: function() {
        helper.setDefaults(this, this.getDefaultValues());
      },

      setCodeAndExpiration: function() {
        this.expirationTime = PhoneNumberConfirmation.newExpirationTime();
        return randomBytes(20)
          .then(function(buf) {
            return this.code = buf.toString('hex');
          }.bind(this));
      },

      isExpired: function(now) {
        var nowAsMoment = moment(now);
        var expirationAsMoment = moment(this.expirationTime);
        return nowAsMoment.isSame(expirationAsMoment) || nowAsMoment.isAfter(expirationAsMoment);
      },

      markUsed: function() {
        return this.updateAttributes({ isUsed: true });
      }
    },
    classMethods: {
      associate: function(models) {
        PhoneNumberConfirmation.belongsTo(models.User, { foreignKey: 'userId' });
      },

      newExpirationTime: function() {
        return moment().add(3, 'hours');
      },

      newCode: function(cb) {
        return crypto.randomBytes(20);
      }
    }

  });

  PhoneNumberConfirmation.addHook('beforeValidate', function(confirm) {
    confirm.setDefaults();
  });

  PhoneNumberConfirmation.addHook('beforeValidate', function(confirm) {
    return confirm.setCodeAndExpiration();
  });

  return PhoneNumberConfirmation;
};
