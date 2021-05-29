var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('AccessToken', AccessToken);
