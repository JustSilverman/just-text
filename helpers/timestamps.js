'use strict';

var sequelize = require('sequelize');
var assign = require('object.assign');

var DEFAULT_PROPERTIES = ['createdAt', 'updatedAt'];

var Timestamps = {
  addToSchema: function(schema, properties) {
    properties = properties || DEFAULT_PROPERTIES;
    var timestamps = properties.reduce(function(schema, prop) {
      schema[prop] = {
        type: sequelize.DATE,
        allowNull: false
      };

      return schema;
    }, {});

    return assign(timestamps, schema);
  }
}

module.exports = Timestamps;
