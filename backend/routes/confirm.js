var express = require('express');
var passport = require('passport');
var router = express.Router();

var moment = require('moment')

const send_request = require('request')

const config = require('../config');

const fs = require("fs")
const path = require('path')

const Utils = require("../utils")

const User = require('../model/user');

const LK_URL = config.get("lk_url")

let confirmUser = (user, type, res) => {
    user.confirmed = true

    if (!user.qex_id){
        send_request(LK_URL+"register-user/email=" + user.email,
            (err, response, body) => {
                if (JSON.parse(body).success === 1){
                    user.qex_id = JSON.parse(body).user_id
                    send_request(LK_URL+"update-user?id=" + JSON.parse(body).user_id,
                        {
                            'method': 'POST',
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            'body': JSON.stringify({"password": user.hashedPassword })
                        })
                    send_request(LK_URL+"change-user-messenger-id/id="+user.qex_id+"&messenger_user_id="+user.userId)
                }
            })
    } else {
        send_request(LK_URL+"update-user?id=" + user.qex_id,
            {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({"email_verified_at": moment().format('YYYY-MM-DD HH:MM:ss')})
            })
    }

    user.save((err, user) => {
        if (err) {
            if (type == "code"){
                return res.status(500).json({
                    error: "An error has occurred"
                })
            } else {
                getConfirmPage("error", res, user.lang)
            }
        }

        if (type == "code"){
            res.json({
                message: "Email confirmed"
            })
        } else {
            getConfirmPage("success", res, user.lang)
        }
    })
}

let getConfirmPage = (type, res, lang = "en") => {
    let page = fs.readFileSync(path.resolve("../backend/templates/confirmPage/main.html"), "utf8")
    let langs = require("../templates/confirmPage/langs.json")

    page = page.replace("[[PAGE_TITLE]]", langs[lang][type].page_title)
    page = page.replace("[[TITLE]]", langs[lang][type].title)
    page = page.replace("[[TEXT]]", langs[lang][type].text)
    page = page.replace("[[LOGO_URL]]", config.get("backend_domain") + "assets/images/loginpage_logo.svg")

    res.send(page)
}

router.get('/',
    function (req, res) {
        if (req.query["link"]){
            User.findOne({ confirmLink: req.query["link"] }, function (err, user) {
                if (err) {
                    return getConfirmPage("error", res)
                }

                if (!user) {
                    return getConfirmPage("error", res)
                }
                confirmUser(user,"link", res)
            })
        } else {
            if (!req.query["id"]){
                return res.status(500).json({
                    error: "User ID required"
                })
            }

            if (!req.query["code"]){
                return res.status(500).json({
                    error: "Confirm code required"
                })
            }

            User.findById(req.query["id"], (err, user) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }

                if(!user){
                    return res.status(500).json({
                        error: "User not found"
                    })
                }

                if (!user.checkConfirmCode(req.query["code"])){
                    return res.status(500).json({
                        error: "Incorrect code"
                    })
                }
                confirmUser(user,"code", res)
            })
        }
    }
);

module.exports = router;