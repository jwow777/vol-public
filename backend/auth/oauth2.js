const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const validator = require('validator')

const config = require('../config');
const log = require('../log')(module);

const db = require('../db/mongoose');
const User = require('../model/user');
const Client = require('../model/client');
const AccessToken = require('../model/accessToken');
const RefreshToken = require('../model/refreshToken');

// Create OAuth 2.0 server
const aserver = oauth2orize.createServer();

// Generic error handler
const errFn = function (cb, err) {
    if (err) {
        return cb(err);
    }
};

// Destroy any old tokens and generates a new access and refresh token
const generateTokens = function (data, done) {

    // Curries in `done` callback so we don't need to pass it
    const errorHandler = errFn.bind(undefined, done);
    let refreshToken,
        refreshTokenValue,
        token,
        tokenValue;

    RefreshToken.deleteMany(data, errorHandler);
    AccessToken.deleteMany(data, errorHandler);

    //tokenValue = crypto.randomBytes(32).toString('hex');
    tokenValue = jwt.sign(
        { userId: data.userId, clientId: data.clientId },
        config.get('jwtSecret'),
        { expiresIn: config.get('security:tokenLife') + 's' }
    )
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessToken({token: data.token});

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    refreshToken.save(errorHandler);

    token.save(function (err) {
        if (err) {
            log.error(err);
            return done(err);
        }
        done(null, tokenValue, refreshTokenValue, {
            'expires_in': config.get('security:tokenLife')
        });
    });
};

//Client Credentials
aserver.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {
    const errorHandler = errFn.bind(undefined, done);
    Client.findOne({ clientId: client.clientId }, function (err, found) {

        if (err) {
            return done(err);
        }

        if (!found || !found.checkSecret(client.clientSecret)) {
            return done(null, false);
        }

        const data = {
            clientId: client.clientId
        };

        AccessToken.deleteMany(data, errorHandler);
        //tokenValue = crypto.randomBytes(32).toString('hex');
        tokenValue = jwt.sign(
            { clientId: data.clientId, type: "client_credentials" },
            config.get('jwtSecret'),
            { expiresIn: config.get('security:tokenLife') + 's' }
        )
        data.token = tokenValue;
        token = new AccessToken({token: data.token});

        token.save(function (err) {
            if (err) {
                log.error(err);
                return done(err);
            }
            done(null, tokenValue, {
                'expires_in': config.get('security:tokenLife')
            });
        });
    });
}));

// Exchange username/email & password for access token
aserver.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {

    Client.findOne({ clientId: client.clientId }, function (err, found) {

        if (err) {
            return done(err);
        }

        if (!found || !found.checkSecret(client.clientSecret)) {
            return done(null, false);
        }

        if (!found.isOfficial()) {
            return done(new Error("This client is unofficial. This type of authorization permission is not supported for unofficial clients."), false);
        }

        let filter = {}
        //isMobilePhone - телефон
        //isEmail - почта
        if (validator.isEmail(username)){
            filter = { email: username }
        } else filter = { username: username }

        User.findOne(filter, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user || !user.checkPassword(password)) {
                return done(null, false);
            }

            const model = {
                userId: user.userId,
                clientId: client.clientId
            };

            generateTokens(model, done);
        })
    })

}));


//Вариант с номером телефона (пока не используется)
// Exchange user phone number & auth code for access token
// aserver.exchange(oauth2orize.exchange.password(function (client, phone, authCode, scope, done) {
//
//     User.findOne({ phone: phone }, function (err, user) {
//
//         if (err) {
//             return done(err);
//         }
//
//         if (!user || !user.checkAuthCode(authCode)) {
//             return done(null, false);
//         }
//
//         const model = {
//             userId: user.userId,
//             clientId: client.clientId
//         };
//
//         user.authCode = undefined
//         user.save()
//
//         generateTokens(model, done);
//     });
//
// }));

// Exchange refreshToken for access token
aserver.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {

    RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function (err, token) {
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null, false);
        }

        User.findById(token.userId, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            const model = {
                userId: user.userId,
                clientId: client.clientId
            };

            generateTokens(model, done);
        });
    });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    aserver.token(),
    aserver.errorHandler()
];
