'use strict';

var User  = require('../models').User;
var sessions = require('../helpers/sessions');
var toErrorMap = require('../helpers/controller').toErrorMap;

var userController = {
  newUser: function(req, res) {
    res.render('signup')
  },

  getUser: function(req, res) {
    if (req.params.id !== req.session.user.id) {
      return res.redirect('/users/' + req.session.user.id);
    }

    res.render('profile', { user: req.session.user });
  },

  createUser: function(req, res) {
    return User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password
    })
    .then(function(user) {
      sessions.loginUser(user, req, res);
      res.redirect('/users/' + user.id);
    })
    .catch(function(userResult) {
      res.render('signup', { errors: toErrorMap(userResult.errors) });
    });
  }
};

module.exports = userController;
