'use strict';

var helper = require('helpers/model');

describe('model helepr', function() {
  var definitions = {
    name: {
      defaultValue: 'homestar'
    },
    lastName: {
      value: 'Runner'
    },
    age: {
      defaultValue: 12
    }
  };

  describe('#getDefaultValues', function() {
    it('should return an empty map if passed an empty map', function() {
      assert.deepEqual(helper.getDefaultValues({}), {});
    });

    it('should return an empty map of properties and default values', function() {

      assert.deepEqual(helper.getDefaultValues(definitions), {
        name: 'homestar',
        age: 12
      });
    });
  });

  describe('#setDefaults', function() {
    it('should set default values on an object', function() {
      var model = {};
      var defaults = {
        name: 'homestar',
        age: 12
      };

      helper.setDefaults(model, defaults);
      assert.deepEqual(model, {
        name: 'homestar',
        age: 12
      });
    });

    it('should only overwrite null, undefined or missing properties', function() {
      var model = {
        name: '',
        lastName: null,
        age: 0
      };
      var defaults = {
        name: 'homestar',
        middleName: 'the',
        lastName: 'Runner',
        age: 12
      };

      helper.setDefaults(model, defaults);
      assert.deepEqual(model, {
        name: '',
        middleName: 'the',
        lastName: 'Runner',
        age: 0
      });
    });
  });
});