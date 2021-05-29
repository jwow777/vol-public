var express = require('express');
var passport = require('passport');
var router = express.Router();

const sharp = require('sharp')

const path = require('path')

const FileType = require('file-type')

router.get("/:file", async (req,res) => {
    try {
        let filePath = require.main.path + "/uploads/images/" + req.params.file

        let image = sharp(path.resolve(filePath))

        let size = {}
        if (!Number.isNaN(Number(req.query["w"]))){
            size.width = Number(req.query["w"])
        }
        if (!Number.isNaN(Number(req.query["h"]))){
            size.height = Number(req.query["h"])
        }

        image.resize(size)

        let options = {}
        if (!Number.isNaN(Number(req.query["quality"]))){
            options.quality = Number(req.query["quality"])
        }

        if (req.query["format"] != undefined){
            if (req.query["format"] == "jpg" || req.query["format"] == "jpeg"){
                image.jpeg(options)
            } else if (req.query["format"] == "png"){
                image.png(options)
            } else if (req.query["format"] == "webp"){
                image.webp(options)
            } else if (req.query["format"] == "gif"){
                image.gif(options)
            }
        } else {
            const type = await FileType.fromFile(filePath)
            if (type.ext == "jpg" || type.ext == "jpeg"){
                image.jpeg(options)
            } else if (type.ext == "png"){
                image.png(options)
            } else if (type.ext == "webp"){
                image.webp(options)
            } else if (type.ext == "gif"){
                image.gif(options)
            }
        }

        image.toBuffer(async function(err, a) {
            const type = await FileType.fromBuffer(a)
            res.setHeader("Content-Type", type.mime)
            res.write(a)
            res.send()
        })
    } catch (e) {
        let message = ""
        let statusCode = 500
        if (e.code == "ENOENT") {
            message = "File not found"
            statusCode = 404
        } else {
            message = e.message
        }

        res.status(statusCode).json({
            error: message
        })
    }

})

module.exports = router;