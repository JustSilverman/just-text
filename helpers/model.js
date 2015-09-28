'use strict';

var modelHelper = {
  getDefaultValues: function(definitions) {
    return Object.keys(definitions).reduce(function(memo, currKey) {
      var defaultValue = definitions[currKey].defaultValue;

      if (defaultValue !== undefined) {
        memo[currKey] = defaultValue;
      }
      return memo;
    }, {});
  },

  setDefaults: function(model, defaultValues) {
    Object.keys(defaultValues).forEach(function(key) {
      if ((model[key] === undefined || model[key] === null) &&
          defaultValues[key] !== undefined) {
        model[key] = defaultValues[key];
      }
    });
  }
}

module.exports = modelHelper;
