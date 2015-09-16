'use strict';

var express = require('express');
var router = express.Router();
var sessions = require('../helpers/sessions');
var User   = require('../models').User;

var sessionsController = {
  loginPage: function(req, res) {
    res.render('login');
  },

  loginUser: function(req, res) {
    return User.authenticate(req.body.email, req.body.password)
      .then(function(user) {
        sessions.loginUser(user, req, res);
        res.redirect('/');
      })
      .catch(function(err) {
        res.render('login', { message: 'Invalid email or password' });
      });
  },

  logout: function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = sessionsController;
