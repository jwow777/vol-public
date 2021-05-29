var express = require('express');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
const config = require('../config');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Utils = require("../utils")

const send_request = require('request')
const axios = require('axios')

const fs = require("fs")
const path = require('path')

const sharp = require('sharp')
const got = require('got')
const FileType = require('file-type')

const nodemailer = require('nodemailer')

const User = require('../model/user')
const AccessToken = require('../model/accessToken')
const RefreshToken = require('../model/refreshToken')
const Image = require('../model/image')

var db = require('../db/mongoose');

const LK_URL = config.get("lk_url")

let sendCode = (email, lang = "en", code, link, res, callback) => {
    let subject = require("../langs/" + lang + ".json")
    subject = subject.confirm_mail_subject

    let body = fs.readFileSync(path.resolve("../backend/templates/email/main.html"), "utf8")
    let body_text = fs.readFileSync(path.resolve("../backend/templates/email/confirm_" + lang + ".html"), "utf8")

    body_text = body_text.replace("[[CODE]]", code)

    body = body.replace("[[BODY_TEXT]]", body_text)
    body = body.replace("[[LOGO_URL]]", config.get("backend_domain") + "assets/images/loginpage_logo.svg")
    body = body.replace("[[LINK]]", "<a href=\"" + config.get("backend_domain") + "confirm?link=" + link + "\" target='_blank'>" + config.get("backend_domain") + "confirm?link=" + link + "</a>")

    let transporter = nodemailer.createTransport({
        host: config.get("email:host"),
        port: config.get("email:port"),
        secure: config.get("email:secure"),
        auth: config.get("email:auth"),
    })

    transporter.sendMail({
        from: config.get("email:from"),
        to: email,
        subject: subject,
        html: body,
    }, (err, info) => {
        if (err) {
            return res.status(500).json({
                error: err,
                email: email
            })
        } else {
            callback()
        }
    })
}

let generateToken = (data, res) => {
    let tokenValue = jwt.sign(
        { userId: data.userId, clientId: data.clientId },
        config.get('jwtSecret'),
        { expiresIn: config.get('security:tokenLife') + 's' }
    )
    let refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    let token = new AccessToken({token: data.token});

    data.token = refreshTokenValue;
    let refreshToken = new RefreshToken(data);

    refreshToken.save(function (err){
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
    });

    token.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        res.json({
            message: "User created!",
            access_token: tokenValue,
            refresh_token: refreshTokenValue,
            expires_in: config.get('security:tokenLife'),
            token_type: "Bearer"
        })
    });
}

let importAvatar = async (url, user) => {
    let lk_avatar
    if (validator.isURL(url)) {
        lk_avatar = url
    } else lk_avatar = LK_URL + url
    const type = await FileType.fromStream(got.stream(lk_avatar))
    let filename = user.userId + "_" + Date.now() + "." + type.ext
    const input = (await axios({ url: lk_avatar, responseType: "arraybuffer" }))
    const buffer = Buffer.from(input.data, 'binary')
    let image = sharp(buffer)
    image.toFile(require.main.path + '/uploads/images/' + filename, (err) => {
        if (err) {
            console.log(err)
        }
    })
    let avatar = new Image({
        file: filename,
        ownerId: user.userId
    })
    avatar.save((err) => {
        if (err){
            return res.status(500).json({
                error: "Error while saving imported avatar",
                info: err
            })
        }
    })
    return avatar
}

router.get('/:id?', passport.authenticate('bearer', { session: false }),
    async (req, res) => {
        let out = {}
        let userData = {}
        if (req.params.id){
            userData = await User.findById(req.params.id, (err) => {
                if (err) {
                    return res.status(404).json({
                        error: "User not found",
                        id: req.params.id
                    })
                }
            })
        } else userData = req.user

        out = {
            id: userData.userId,
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            phone: userData.phone
        }

        if (userData.photo){
            let photoData = await Image.findById(userData.photo)
            out.photo = {
                id: photoData._id,
                src: config.get("backend_domain") + "img/" + photoData.file,
                created: photoData.created
            }
        }

        res.json(out)
    }
)

router.post('/', passport.authenticate('bearer', { session: false }),
    function (req, res) {

        let client = req.authInfo.client
        if (!client || !client.official){
            return res.status(403).json({
                error: "Permission denied"
            })
        }

        if (!req.authInfo.decoded.type || req.authInfo.decoded.type !== "client_credentials"){
            return res.status(500).json({
                error: "When creating a user, the client must have authorization permission type \"client_credentials\""
            })
        }

        let lang
        if (!req.query["email_lang"]){
            lang = "en"
        } else lang = req.query["email_lang"]

        if (req.query["qex_id"]){
            send_request(LK_URL+'get-user-data/id='+req.query["qex_id"], async (err, response, body) => {
                if(err)
                    return res.status(500).json({
                        error: err,
                        qex_id: req.query["qex_id"]
                    })

                if (JSON.parse(body).success == 1) {
                    let userData = JSON.parse(body).user

                    User.findOne({ email: userData.email }, async (err, user) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        }

                        if (user){
                            return res.status(500).json({
                                error: "User with this email already exists",
                                email: userData.email
                            })
                        }

                        user = new User()

                        if (userData.email != null){
                            user.email = userData.email
                        }

                        if (userData.password != null){
                            user.hashedPassword = userData.password
                            user.salt = bcrypt.genSaltSync(10)
                        }

                        if (userData.name != null){
                            user.name = userData.name
                        }

                        if (userData.surname != null){
                            user.surname = userData.surname
                        }

                        if (userData.phone != null){
                            user.phone = userData.phone
                        }

                        if (userData.photo !== "/images/no-photo.jpg"){
                            let avatar = await importAvatar(userData.photo, user)
                            user.photo = avatar._id
                        }

                        user.qex_id = req.query["qex_id"]

                        user.lang = lang

                        if (userData.email_verified_at != null){
                            user.confirmed = true
                            send_request(LK_URL+"change-user-messenger-id/id="+user.qex_id+"&messenger_user_id="+user.userId)
                            user.save(function (err, user) {
                                if (err) {
                                    return res.status(500).json({
                                        error: err,
                                        email: req.query["email"]
                                    })
                                } else {
                                    const data = {
                                        userId: user.userId,
                                        clientId: client.clientId
                                    }
                                    generateToken(data, res)
                                }
                            })
                        } else {
                            const code = Utils.getConfirmCode()
                            const link = crypto.randomBytes(20).toString('hex')
                            user.confirmCode = code
                            user.confirmLink = link
                            user.save(function (err, user) {
                                if (err) {
                                    return res.status(500).json({
                                        error: err,
                                        email: req.query["email"]
                                    })
                                } else {
                                    sendCode(userData.email, lang, code, link, res, () => {
                                        const data = {
                                            userId: user.userId,
                                            clientId: client.clientId
                                        }
                                        generateToken(data, res)
                                    })
                                }
                            })
                        }
                    })
                } else {
                    return res.status(500).json({
                        error: "Failed to get user data",
                        qex_id: req.query["qex_id"]
                    })
                }
            });
        } else {
            if (!req.query["email"]){
                return res.status(500).json({
                    error: "Email required"
                })
            }

            if (!validator.isEmail(req.query["email"])){
                return res.status(500).json({
                    error: "Invalid Email"
                })
            }

            if (!req.query["password"]){
                return res.status(500).json({
                    error: "Password required"
                })
            }

            if (!validator.isLength(req.query["password"], { min: 6 })){
                return res.status(500).json({
                    error: "Invalid password"
                })
            }

            User.findOne({ email : req.query["email"] }, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        error: "An error has occurred"
                    })
                }

                if (user) {
                    return res.status(500).json({
                        error: "User with this email already exists",
                        email: req.query["email"]
                    })
                } else {

                    user = new User({
                        email: req.query["email"],
                        password: req.query["password"]
                    })

                    const code = Utils.getConfirmCode()

                    const link = crypto.randomBytes(20).toString('hex')

                    user.confirmCode = code
                    user.confirmLink = link

                    user.lang = lang

                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                                email: req.query["email"]
                            })
                        } else {
                            sendCode(req.query["email"], lang, code, link, res, () => {
                                const data = {
                                    userId: user.userId,
                                    clientId: client.clientId
                                }

                                generateToken(data, res)
                            })
                        }
                    })
                }
            })
        }
    }
)



module.exports = router;
