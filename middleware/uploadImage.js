"use strict"
/**
 * 流式上传文件中间件
 */

const { createWriteStream } = require("fs")
const { createHash } = require("crypto")
const { join } = require("path")

// 服务器支持的所有文件格式
const supportedImageType = {
    ".jpg": true,
    ".png": true,
    ".jpge": true,
    ".webp": true
}

const uploadUserImageMap = {}

module.exports = async function (req, res, next) {
    const { type } = req.body
    console.log(type)
    switch (type) {
        case "open":
            openTypeOperate(req, res)
            break
        case "data":
            dataTypeOperate(req, res)
            break
        case "end":
            endTypeOperate(req, res, next)
            break
        case "error":
            errorTypeOperate(req, res)
            break
        default:
            notMatchTypeOperate(req, res)
            break
    }
}

function openTypeOperate(req, res) {
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
    hash.update(`${req.tokenData.id}-${req.tokenData.avatar}-${req.body.name}-avatar`, "utf-8")
    const fileName = `${hash.digest("hex").slice(0, 45)}-avatar${req.body.ext}`
    const newFilePath = join(__dirname, `../${process.env["STATIC_RESOURCE_ORIGIN"]}/${req.imageuse}/${fileName}`)

    uploadUserImageMap[req.tokenData.account] ??= {}
    uploadUserImageMap[req.tokenData.account][req.imageuse] = {
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
}

function dataTypeOperate(req, res) {
    if (!req.body.data) {
        res.send({
            code: 404,
            post: false,
            msg: "数据为空"
        })
        return
    }

    const fileStreamInfo = uploadUserImageMap[req.tokenData.account][req.imageuse]
    if (!fileStreamInfo) {
        res.send({
            code: 404,
            post: false,
            msg: `未创建${req.imageuse}的写入流`
        })
        return
    }

    fileStreamInfo.stream.write(req.body.data, () => {
        res.send({
            code: 200,
            post: true
        })
    })
}

function errorTypeOperate(req, res) {
    const UserUploadAvatarInfo = uploadUserImageMap[req.tokenData.account][req.imageuse]
    if (UserUploadAvatarInfo) {
        UserUploadAvatarInfo.stream.end()
        uploadUserImageMap[req.tokenData.account][req.imageuse] = null

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
}

function endTypeOperate(req, _, next) {
    const fileUse = req.imageuse
    const UserUploadAvatarInfo = uploadUserImageMap[req.tokenData.account][fileUse]
    req.imageName = UserUploadAvatarInfo.name
    UserUploadAvatarInfo.stream.end()
    console.log(req.imageName, "end")
    uploadUserImageMap[req.tokenData.account][fileUse] = null
    next()
}

function notMatchTypeOperate(_, res) {
    res.send({
        code: 400,
        post: false,
        msg: "type类型错误"
    })
}
