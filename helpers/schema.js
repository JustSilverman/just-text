'use strict';

var sequelize = require('sequelize');
var assign = require('object.assign');

var DEFAULT_PROPERTIES = ['createdAt', 'updatedAt'];
var VIRTUAL_PROPERTIES = [sequelize.VIRTUAL, sequelize.NONE];

var schema = {
  addTimestampsToSchema: function(schema, properties) {
    properties = properties || DEFAULT_PROPERTIES;
    var timestamps = properties.reduce(function(schema, prop) {
      schema[prop] = {
        type: sequelize.DATE,
        allowNull: false
      };

      return schema;
    }, {});

    return assign(timestamps, schema);
  },

  removeVirtual: function(schema) {
    return Object.keys(schema).reduce(function(newSchema, prop) {
      if (VIRTUAL_PROPERTIES.indexOf(schema[prop].type) === -1) {
        newSchema[prop] = schema[prop];
      }

      return newSchema;
    }, {});
  }
}

module.exports = schema;
