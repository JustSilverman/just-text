var express = require('express');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var settings = require('./config/settings');
var session = require('./middleware/session');
var sessionUpdater = require('./middleware/session_updater');

var app = express();

app.use(morgan('combined'));
app.use(errorhandler());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serveStatic(__dirname + '/public'));
app.use(session);
app.use(sessionUpdater);

app.listen(settings.port, function() {
  process.stdout.write('Listening on port ' + settings.port + '...');
});
