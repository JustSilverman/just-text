'use strict';

var User  = require('../models').User;

function sessionUpdater(req, res, next) {
  if (!req.session) {
    return next();
  }

  if (!req.session.user) {
    req.session.destroy();
    return next();
  }

  User.findById(req.session.user.id)
    .then(function(user) {
      if (!user) {
        req.session.destroy();
        return next();
      }

      user.passwordHash = undefined;
      req.user = user;
      req.session.user = user;
      res.locals.user = user;

      next();
    });
};

module.exports = sessionUpdater;
