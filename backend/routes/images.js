var express = require('express');
var passport = require('passport');
var router = express.Router();

const config = require('../config')

const multer  = require("multer")
const mime = require('mime-types')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, require.main.path + '/uploads/images')
    },
    filename: function (req, file, cb) {
        if (!req.user.userId) {
            return cb(new Error('To upload files, the client must have permission from the user on whose behalf these files are upload.'), false)
        }
        const ext = mime.extension(file.mimetype)
        cb(null, req.user.userId + "_" + Date.now() + "." + ext)
    }
})

var maxSize = 50 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/gif' &&
        file.mimetype !== 'image/webp') {
        return cb(new Error('Only JPG, PNG, GIF and WEBP images are supported'), false)
    }
    cb(null, true)
} })

const Image = require('../model/image')

router.post("/",
    [passport.authenticate('bearer', { session: false }),
        upload.array('images', 100)],
    (req, res) => {
        if (!req.files || req.files.length == 0){
            return res.status(500).json({error: "No files to upload"})
        }
        let images = []
        for (var i = 0; i < req.files.length; i++){
            let image = new Image({
                file: req.files[i].filename,
                ownerId: req.user.userId
            })
            image.save()
            images.push({
                id: image._id,
                src: config.get("backend_domain") + "img/" + image.file,
                ownerId: image.ownerId,
                created: image.created
            })
        }
        res.json(images)
    })

module.exports = router;