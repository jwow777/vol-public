var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');

var cors = require('cors')

var favicon = require('serve-favicon')

require('./auth/auth');

var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');

var api = require('./routes/api');
var ajax = require('./routes/ajax');
var users = require('./routes/users');
var confirm = require('./routes/confirm');
var images = require('./routes/images');
var img = require('./routes/img');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors())

app.use('/', api);
app.use('/api', api);
app.use('/ajax', ajax);
app.use('/confirm', confirm);
app.use('/img', img);
app.use('/api/images', images);
app.use('/api/users', users);
app.use('/api/oauth/token', oauth2.token);

app.use("/assets", express.static(path.join(__dirname,'assets')))

app.use(favicon(path.join(__dirname,'favicon.ico')))

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

app.set('port', process.env.PORT || config.get('port') || 3000);

var server = app.listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});

