'use strict';

var sessions = {
  requireLogin: function(req, res, next) {
    if (!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  }
}

module.exports = sessions;
