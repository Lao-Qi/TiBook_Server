"use strict"
const router = require("express").Router()
const user = require("./Route/User")
const search = require("./Route/Search")
const { publicKey, VerifyTimeIsOut } = require("./lib/keys.js")

// 设置下面所有接口的响应头
router.use((_, res, next) => {
    res.set("Content-Type", "application/json; charset=utf-8")
    next()
})

router.use("/user", user)
router.use("/search", search)

// 公钥接口
router.get("/publicKey", (_, res) => {
    // 发送服务端的公钥
    res.send({
        code: 200,
        publicKey: Buffer.from(publicKey).toString("base64")
    })
})

// 验证token接口
router.get("/verifyToken", (req, res) => {
    if (req.headers.token) {
        if (VerifyTimeIsOut(req.headers.token)) {
            res.send({
                code: 200,
                data: true,
                msg: "token验证成功"
            })
        } else {
            res.send({
                code: 200,
                data: false,
                msg: "token已过期"
            })
        }
    } else {
        res.send({
            code: 404,
            data: false,
            msg: "token为空"
        })
    }
})

module.exports = router
