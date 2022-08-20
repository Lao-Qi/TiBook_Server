"use strict"
/**
 * 这个中间件作用只有一个，就是在uploadImage/PPictures接口处理最后的操作
 */
const { rm } = require("fs")
const { join } = require("path")

module.exports = function (req, res, next) {
    if (req.params.use === "PPictures") {
        if (req.userInfoDoc.cover !== "none" && req.imageName !== req.userInfoDoc.cover) {
            rm(
                join(
                    __dirname,
                    `../${process.env["STATIC_RESOURCE_ORIGIN"]}/PersonalizedPictures/${req.userInfoDoc.cover}`
                ),
                err => {
                    if (err) console.error(err)
                }
            )
        }

        req.userInfoDoc.cover = req.imageName
        req.userInfoDoc
            .save()
            .then(() => {
                res.send({
                    code: 200,
                    msg: "上传成功"
                })
            })
            .catch(err => {
                res.send({
                    code: 500,
                    msg: "上传失败，可能为服务器的原因"
                })
                console.error(err)
            })
    } else {
        next()
    }
}
