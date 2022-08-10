"use strict"
/**
 * 用户修改头像接口   POST
 *
 * img 头像图片被编码成base64编码后的数据 [必须]
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

/** base64方式上传头像文件 */
router.post("/uploadAvatar", verifyToken, FindTokenAccountUser, async (req, res) => {
    const body = req.body

    if (body.img && body.ext) {
        if (!supportedImageType[body.ext]) {
            res.send({
                code: 400,
                ext: body.ext,
                post: false,
                supportedType: Object.keys(supportedImageType),
                msg: "图片格式不在服务器支持的范围内"
            })
            return
        }
        // 修改用户头像名称
        const fileName = `${req.tokenData.account}${body.ext}`
        // 用户不存在时，doc为空
        req.doc.avatar = fileName
        req.doc.save()

        writeFile(
            process.env["STATIC_RESOURCE_ORIGIN_TYPE"] === "path"
                ? join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/user/${fileName}`)
                : process.env["STATIC_RESOURCE_ORIGIN"],
            body.img,
            "base64",
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
                res.send({
                    code: 200,
                    post: true,
                    msg: "上传成功"
                })
            }
        )
    } else {
        res.send({
            code: 400,
            post: false,
            msg: "数据缺失"
        })
    }
})

module.exports = router
