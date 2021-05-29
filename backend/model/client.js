var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Client = new Schema({
        name: {
            type: String,
            required: true
        },
        clientId: {
            type: String,
            unique: true,
            required: true
        },
        clientSecret: {
            type: String,
            required: true
        },
        official: {
            type: Boolean,
            default: false,
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }, { versionKey: false });

Client.methods.checkSecret = function (secret) {
    return secret === this.clientSecret;
};

Client.methods.isOfficial = function () {
    return this.official;
};

module.exports = mongoose.model('Client', Client);
