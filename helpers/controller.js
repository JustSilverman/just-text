'use strict';

var controllerHelper = {
  toErrorMap: function(errors) {
    if (!errors) {
      return [];
    }

    return errors.map(function(errorPayload) {
      return { field: errorPayload.path, message: errorPayload.message };
    });
  }
};

module.exports = controllerHelper;
