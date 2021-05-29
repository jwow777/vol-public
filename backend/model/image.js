var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = mongoose.Types,

    Image = new Schema({
        file: {
            type: String,
            required: true
        },
        ownerId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    }, { versionKey: false })

module.exports = mongoose.model('Image', Image);