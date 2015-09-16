'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');
require('app-module-path').addPath(__dirname);

var settings = require('./config/settings');
var sessions = require('client-sessions');
var sessionUpdater = require('./middleware/session_updater');
var router = require('./config/router');

var app = express();

app.use(morgan('combined'));
app.use(errorhandler());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serveStatic(__dirname + '/public'));
app.use(sessions(settings.session));
app.use(sessionUpdater);
app.use(router);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(settings.port, function() {
  process.stdout.write('Listening on port ' + settings.port + '...');
});
