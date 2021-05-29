var mongoose = require('mongoose'),
    crypto = require('crypto'),
    bcrypt = require('bcryptjs'),

    Schema = mongoose.Schema,

    authCode = new Schema({
        _id: false,
        code: {
            type: String
        },
        iat: {
            type: Number
        },
        exp: {
            type: Number
        }
    }),

    User = new Schema({
        username: {
            type: String,
            unique: true,
            required: false,
            sparse: true
        },
        name: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        phone: {
          type: String,
          unique: true,
          required: false,
            sparse: true
        },
        photo: {
            type: String
        },
        authCode: {
            type: authCode
        },
        confirmCode: {
            type: String
        },
        confirmLink: {
            type: String,
            unique: true,
            required: false,
            sparse: true
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        qex_id: {
            type: String,
            unique: true,
            sparse: true
        },
        lang: {
            type: String
        },
        salt: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    }, { versionKey: false });

User.methods.encryptPassword = function (password) {
    //return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return bcrypt.hashSync(password, this.salt)
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        //this.salt = crypto.randomBytes(128).toString('hex');
        this.salt = bcrypt.genSaltSync(10)
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });


User.methods.checkPassword = function (password) {
    //return this.encryptPassword(password) === this.hashedPassword;
    return bcrypt.compareSync(password, this.hashedPassword)
};

User.methods.checkAuthCode = function (code) {
    return (code === this.authCode.code) && (this.authCode.exp > Date.now())
};

User.methods.checkConfirmCode = function (code) {
    return code === this.confirmCode
};

module.exports = mongoose.model('User', User);
