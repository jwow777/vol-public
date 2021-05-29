var faker = require('faker');

var log = require('./log')(module);
var db = require('./db/mongoose');
var config = require('./config');

var User = require('./model/user');
var Client = require('./model/client');
var AccessToken = require('./model/accessToken');
var RefreshToken = require('./model/refreshToken');

User.deleteMany({}, function (err) {
    var user = new User({
        email: config.get('default:user:email'),
        password: config.get('default:user:password')
    });

    user.save(function (err, user) {
        if (!err) {
            log.info('New user - %s:%s', user.username, user.password);
        } else {
            return log.error(err);
        }
    });
});

Client.deleteMany({}, function (err) {
    var client = new Client({
        name: config.get('default:client:name'),
        clientId: config.get('default:client:clientId'),
        clientSecret: config.get('default:client:clientSecret'),
        type: config.get('default:client:type'),
        verified: config.get('default:client:verified'),
        official: config.get('default:client:official')
    });

    client.save(function (err, client) {

        if (!err) {
            log.info('New client - %s:%s', client.clientId, client.clientSecret);
        } else {
            return log.error(err);
        }

    });
});

AccessToken.deleteMany({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

RefreshToken.deleteMany({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

setTimeout(function () {
    db.disconnect();
}, 3000);
