'use strict';

var SchemaFetcher = {
  fetch: function(modelName, version) {
    return require('./models/' + [modelName, '_', version].join(''));
  }
};

module.exports = SchemaFetcher;
