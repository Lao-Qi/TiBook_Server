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
const RSA_JWT = require("../../lib/keys")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const { createWriteStream, rm } = require("fs")
const { join } = require("path")
const { createHash } = require("crypto")
const router = require("express").Router()

const uploadAvatarMap = {}

const supportedImageType = {
    ".jpg": true,
    ".png": true,
    ".jpge": true,
    ".webp": true
}

router.post("/uploadAvatar", verifyToken, async (req, res, next) => {
    const { type } = req.body
    console.log(type)
    if (type === "open" || type === "data" || type === "end" || type === "error") {
        next()
    } else {
        res.send({
            code: 400,
            post: false,
            msg: "type类型错误"
        })
    }
})

router.post("/uploadAvatar", async (req, res, next) => {
    if (req.body.type === "open") {
        if (!(req.body.ext && req.body.encode && req.body.name)) {
            res.send({
                code: 400,
                post: false,
                msg: "缺少参数"
            })
            return
        }

        if (!supportedImageType[req.body.ext]) {
            res.send({
                code: 404,
                post: false,
                msg: "提供了服务器不支持的图片类型"
            })
        }

        const hash = createHash("sha256")
        hash.update(`${req.tokenData.id}-${req.body.name}-avatar`, "utf-8")

        const fileName = `${hash.digest("hex")}-avatar${req.body.ext}`
        console.log(fileName)
        const newFilePath = join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/avatar/${fileName}`)

        uploadAvatarMap[req.tokenData.account] = {
            name: fileName,
            stream: createWriteStream(newFilePath, {
                encoding: req.body.encode
            })
        }

        res.send({
            code: 200,
            post: true
        })
    } else {
        next()
    }
})

router.post("/uploadAvatar", async (req, res, next) => {
    if (req.body.type === "data") {
        if (!req.body.data) {
            res.send({
                code: 404,
                post: false,
                msg: "数据为空"
            })
            return
        }

        const fileStreamInfo = uploadAvatarMap[req.tokenData.account]
        if (!fileStreamInfo) {
            res.send({
                code: 404,
                post: false,
                msg: "未创建写入流"
            })
            return
        }

        fileStreamInfo.stream.write(req.body.data, () => {
            res.send({
                code: 200,
                post: true
            })
        })
    } else {
        next()
    }
})

router.post("/uploadAvatar", async (req, res, next) => {
    if (req.body.type === "error") {
        const UserUploadAvatarInfo = uploadAvatarMap[req.tokenData.account]
        UserUploadAvatarInfo.stream.end()
        uploadAvatarMap[req.tokenData.account] = null

        res.send({
            code: 200,
            post: false,
            msg: "退出成功"
        })
    } else {
        next()
    }
})

router.post("/uploadAvatar", FindTokenAccountUser, FindTokenUserInfo, async (req, res) => {
    if (req.body.type === "end") {
        const UserUploadAvatarInfo = uploadAvatarMap[req.tokenData.account]
        UserUploadAvatarInfo.stream.end()

        rm(join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/avatar/${req.doc.avatar}`), err => {
            if (err) {
                console.error(err.message)
            }
        })

        req.doc.avatar = UserUploadAvatarInfo.name
        req.userInfoDoc.avatar = UserUploadAvatarInfo.name
        uploadAvatarMap[req.tokenData.account] = null

        // 更新token
        const token = RSA_JWT.EncryptJWT({
            id: req.doc._id,
            account: req.doc.account,
            name: req.doc.name,
            // 设置有效时间一个月
            outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
            avatar: UserUploadAvatarInfo.name
        })

        Promise.all([req.doc.save(), req.userInfoDoc.save()])
            .then(() => {
                res.send({
                    code: 200,
                    post: true,
                    path: setAvatarURL(UserUploadAvatarInfo.name),
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
            post: false,
            type: req.body.type,
            msg: "操作类型不存在"
        })
    }
})

module.exports = router
