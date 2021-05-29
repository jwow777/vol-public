var express = require('express');
var passport = require('passport');
var router = express.Router();

const config = require('../config');

const Utils = require("../utils")

const User = require('../model/user');

router.get('/',
    passport.authenticate('bearer', { session: false }),
    function (req, res) {
    res.json({
        message: 'API is running',
        user: req.user,
        client: req.authInfo.client,
        token: req.authInfo.token,
        decoded: req.authInfo.decoded
    });
});

// router.get('/authcode',
//     passport.authenticate('bearer', { session: false }),
//     (req, res) => {
//         let client = req.authInfo.client
//         if (!client || !client.official){
//             return res.json({
//                 message: "Permission denied"
//             })
//         }
//
//         if (!req.query["phone"]){
//             return res.json({
//                 status: "ERROR",
//                 message: "Phone number required"
//             })
//         }
//
//         User.findOne({ phone: req.query["phone"] }, function (err, user) {
//
//             if (err) {
//                 return res.json({
//                     status: "ERROR",
//                     message: err,
//                     phone: req.query["phone"]
//                 })
//             }
//
//             if (!user) {
//                 return res.json({
//                     status: "ERROR",
//                     message: "User not found",
//                     phone: req.query["phone"]
//                 })
//             }
//
//             const code = Utils.getAuthCode()
//
//             let code_created = Date.now()
//
//             user.authCode = {
//                 code: code,
//                 iat: code_created,
//                 exp: code_created + (config.get('security:tokenLife') * 1000)
//             }
//             user.save(() => {
//                 res.json({
//                     status: "SUCCESS",
//                     phone: req.query["phone"],
//                     userId: user.userId,
//                     clientId: client.clientId,
//                     code: code
//                 })
//             })
//         });
//     })

module.exports = router;
