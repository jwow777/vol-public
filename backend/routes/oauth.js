var express = require('express');

var oauth2 = require('../auth/oauth2');
var log = require('../log')(module);
var router = express.Router();

router.post('/token', oauth2.token);

module.exports = router;
