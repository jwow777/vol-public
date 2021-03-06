var mongoose = require('mongoose');

var log = require('../log')(module);
var config = require('../config');

mongoose.connect(config.get('mongoose:uri'), { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});

db.once('open', function callback() {
    log.info('Connected to DB!');
});

module.exports = mongoose;
