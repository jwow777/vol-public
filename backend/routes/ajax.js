var express = require('express');
var passport = require('passport');
var router = express.Router();

var crypto = require('crypto')

const Utils = require("../utils")

const User = require('../model/user');

router.get('/',
    passport.authenticate('bearer', { session: false }),
    function (req, res) {
        res.json({
            message: 'AJAX is running',
            user: req.user,
            client: req.authInfo.client,
            token: req.authInfo.token,
            decoded: req.authInfo.decoded
        });
    });

router.get('/check_user_existence',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
        let client = req.authInfo.client
        if (!client || !client.official){
            return res.status(403).json({
                error: "Permission denied"
            })
        }

        if (!req.query["email"]){
            return res.status(500).json({
                error: "Phone number required"
            })
        }

        User.findOne({ email: req.query["email"] }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    error: err,
                    email: req.query["email"]
                })
            }

            res.json({
                user_exists:  user != null
            })
        })
    })

module.exports = router;
