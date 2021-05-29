var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var config = require('../config');
const jwt = require('jsonwebtoken')

var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

// 2 Client Password strategies - 1st is required, 2nd is optional
// https://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1

// Client Password - HTTP Basic authentication
passport.use(new BasicStrategy(
    function (username, password, done) {
        Client.findOne({ clientId: username }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== password) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

// Client Password - credentials in the request body
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

// Bearer Token strategy
// https://tools.ietf.org/html/rfc6750

passport.use(new BearerStrategy(
    function (accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function (err, token) {

            if (err) {
                return done(err);
            }

            if (!token) {
                return done(null, false);
            }

            jwt.verify(accessToken, config.get("jwtSecret"), function(err, decoded) {
                if (err) {
                    return done(err);
                }

                Client.findOne({ clientId: decoded.clientId }, function (err, client) {
                    if (err) {
                        return done(err);
                    }

                    if (!decoded.userId){
                        if (!client.official) {
                            return done(null, false);
                        } else return done(null, "CLIENT", {token: accessToken, decoded, client});
                    } else {
                        User.findById(decoded.userId, function (err, user) {

                            if (err) {
                                return done(err);
                            }

                            if (!user) {
                                return done(new Error("Unknown user"), false);
                            }

                            done(null, user, {token: accessToken, decoded, client});
                        });
                    }
                });
            });
        });
    }
));
