"use strict"
/**
 * 所有上传图片的路径会先经过这个路由，文件上传接收再转到主要处理此文件的路由
 *
 * 该路由使用的是流式上传
 */

// 服务器支持的所有文件格式
const supportedImageType = {
    ".jpg": true,
    ".png": true,
    ".jpge": true,
    ".webp": true
}

const verifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const uploadAvatar = require("../../middleware/uploadAvatar")
const uploadPPictures = require("../../middleware/uploadPPictures")
const { createWriteStream } = require("fs")
const { join } = require("path")
const { createHash } = require("crypto")
const router = require("express").Router()

const uploadAvatarMap = {}

// 验证上传图片的作用
router.post("/uploadImage/:use", async (req, res, next) => {
    if (req.params.use === "avatar" || req.params.use === "PPictures") {
        next()
    } else {
        res.send({
            code: 404,
            msg: "图片的用途不在服务器接口范围"
        })
    }
})

// 验证上传图片的进度类型
router.post("/uploadImage/:use", verifyToken, async (req, res, next) => {
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

// open进度，向服务器内存中存储图片的写入流
router.post("/uploadImage/:use", async (req, res, next) => {
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

        // 通过文件名和用户的名称
        const hash = createHash("sha256")
        hash.update(`${req.tokenData.id}-${req.tokenData.avatar}-${req.body.name}-avatar`, "utf-8")
        const fileName = `${hash.digest("hex").slice(0, 45)}-avatar${req.body.ext}`
        const newFilePath = join(
            __dirname,
            `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/${req.params.use}/${fileName}`
        )

        // 存储上传的流
        uploadAvatarMap[req.tokenData.account] ??= {}
        uploadAvatarMap[req.tokenData.account][req.params.use] = {
            name: fileName,
            date: Date.now(),
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

// data进度，向服务器间歇性的上传文件的部分数据，服务器接收到后会使用open的写入流向服务器本地写入数据
router.post("/uploadImage/:use", async (req, res, next) => {
    if (req.body.type === "data") {
        if (!req.body.data) {
            res.send({
                code: 404,
                post: false,
                msg: "数据为空"
            })
            return
        }

        const fileStreamInfo = uploadAvatarMap[req.tokenData.account]?.[req.params.use]
        if (!fileStreamInfo) {
            res.send({
                code: 404,
                post: false,
                msg: `未创建${req.params.use}的写入流`
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

// error进度，当客户端读取流出错的时候会传递这个进度，服务器会关闭并清除对应的写入流
router.post("/uploadImage/:use", async (req, res, next) => {
    if (req.body.type === "error") {
        const UserUploadAvatarInfo = uploadAvatarMap[req.tokenData.account]?.[req.params.use]
        if (UserUploadAvatarInfo) {
            UserUploadAvatarInfo.stream.end()
            uploadAvatarMap[req.tokenData.account][req.params.use] = null

            res.send({
                code: 200,
                post: false,
                msg: "退出成功"
            })
        } else {
            res.send({
                code: 200,
                post: false,
                msg: "未创建写入流"
            })
        }
    } else {
        next()
    }
})

// end进度，客户端读取流触发end事件发送到后端，后端停止写入数据并清除写入流，图片上传完成，转接到对应用途的接口
router.post("/uploadImage/:use", async (req, res, next) => {
    if (req.body.type === "end") {
        const fileUse = req.params.use
        const UserUploadAvatarInfo = uploadAvatarMap[req.tokenData.account][fileUse]
        req.imageName = UserUploadAvatarInfo.name
        UserUploadAvatarInfo.stream.end()
        console.log(req.imageName, "end")
        uploadAvatarMap[req.tokenData.account][fileUse] = null
        next()
    } else {
        res.send({
            code: 404,
            post: false,
            type: req.body.type,
            msg: "操作类型不存在"
        })
    }
})

router.post("/uploadImage/:use", FindTokenUserInfo, uploadPPictures, FindTokenAccountUser, uploadAvatar)

module.exports = router
