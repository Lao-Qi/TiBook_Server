"use strict"
/**
 * 用户修改头像接口   POST
 *
 * 前端使用流的方式通过设置body中的type来选择阶段
 * 不同阶段对应流式上传文件的不同过程
 *
 */
const verifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const uploadImage = require("../../middleware/uploadImage")
const RSA_JWT = require("../../lib/keys")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const { rm } = require("fs")
const { join } = require("path")
const router = require("express").Router()

router.post(
    "/uploadAvatar",
    verifyToken,
    async (req, _, next) => {
        req.imageuse = "avatar"
        next()
    },
    uploadImage,
    FindTokenUserInfo,
    FindTokenAccountUser
)

router.post("/uploadAvatar", async (req, res) => {
    if (req.doc.avatar !== req.imageName && req.doc.avatar !== "none") {
        rm(join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/avatar/${req.doc.avatar}`), err => {
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
})

module.exports = router
