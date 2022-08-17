"use strict"
/**
 * 用户修改头个性背景图片   POST
 *
 * img 个性背景图片被编码成binary编码后的数据 [必须]
 * ext 图片的后缀名 [必须]
 *
 */
const verifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const { writeFile } = require("fs")
const { join } = require("path")
const router = require("express").Router()

const supportedImageType = {
    ".jpg": true,
    ".png": true,
    ".jpeg": true,
    ".webp": true
}

router.post("/uploadPPictures", verifyToken, FindTokenAccountUser, (req, res) => {
    const body = req.body

    if (!(body.img && body.ext)) {
        res.send({
            code: 400,
            post: false,
            msg: "数据缺失"
        })
        return
    }

    if (supportedImageType[body.ext]) {
        res.send({
            code: 400,
            ext: body.ext,
            post: false,
            supportedType: Object.keys(supportedImageType),
            msg: "图片格式不在服务器支持的范围内"
        })
        return
    }

    // 修改用户个性图片名称
    const fileName = `${req.tokenData.id}-ppictures${body.ext}`

    writeFile(
        join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/PersonalizedPictures/${fileName}`),
        body.img,
        "binary",
        err => {
            if (err) {
                res.send({
                    code: 500,
                    post: false,
                    msg: "图片写入失败，可能为服务器原因"
                })
                console.error(err)
                return
            }

            req.userInfoDoc.cover = fileName
            req.userInfoDoc
                .save()
                .then(() => {
                    res.send({
                        code: 200,
                        post: true,
                        msg: "上传成功"
                    })
                })
                .catch(err => {
                    res.send({
                        code: 500,
                        post: false,
                        msg: "上传失败，可能为服务器的原因"
                    })
                    console.error(err)
                })
        }
    )
})
module.exports = router
