'use strict';

var controllerHelper = {
  toErrorMap: function(errors) {
    return errors.map(function(errorPayload) {
      return { field: errorPayload.path, message: errorPayload.message };
    });
  }
};

module.exports = controllerHelper;
