"use strict"
/**
 * 这个中间件作用只有一个，就是在uploadImage/avatar接口处理最后的操作
 */

const RSA_JWT = require("../lib/keys")
const { setAvatarURL } = require("../lib/SmallFunctionIntegration")
const { rm } = require("fs")
const { join } = require("path")

module.exports = function (req, res) {
    if (req.params.use === "avatar") {
        if (req.doc.avatar !== "none" && req.doc.avatar !== req.imageName) {
            rm(join(__dirname, `../${process.env["STATIC_RESOURCE_ORIGIN"]}/avatar/${req.doc.avatar}`), err => {
                if (err) {
                    console.error(err.message)
                }
            })
        }

        req.doc.avatar = req.imageName
        req.userInfoDoc.avatar = req.imageName

        // 更新token
        const token = RSA_JWT.EncryptJWT({
            id: req.doc._id,
            account: req.doc.account,
            name: req.doc.name,
            // 设置有效时间一个月
            outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
            avatar: req.imageName
        })

        Promise.all([req.doc.save(), req.userInfoDoc.save()])
            .then(() => {
                res.send({
                    code: 200,
                    post: true,
                    path: setAvatarURL(req.imageName),
                    ntoken: token,
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
    } else {
        res.send({
            code: 404,
            msg: "图片的用途不在服务器接口范围"
        })
    }
}
