'use strict';

var sessions = {
  requireLogin: function(req, res, next) {
    if (!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  },

  loginUser: function(user, req, res) {
    req.session.reset();

    user.passwordHash = undefined;
    req.user = user;
    req.session.user = user;
    res.locals.user = user;
  }
}

module.exports = sessions;
