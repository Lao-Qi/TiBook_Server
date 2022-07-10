"use strict"
const bcryptjs = require("bcryptjs")
const RSA_JWT = require("../../lib/keys.js")
const { Users } = require("../../model/model")
const router = require("express").Router()

/** 登录 */
router.post("/login", async (req, res, next) => {
    if (!req.body.ping) {
        res.send({
            code: 400,
            body: req.body,
            msg: "Ping字段为空",
        })
    } else if (!req.body.account) {
        res.send({
            code: 400,
            body: req.body,
            msg: "账号字段为空",
        })
    } else {
        const doc = await FindUser(req.body.account)
        if (doc) {
            req.doc = doc
            next()
        } else {
            res.send({
                code: 404,
                body: req.body,
                msg: "用户不存在",
            })
        }
    }
})

router.post("/login", async (req, res) => {
    if (bcryptjs.compareSync(RSA_JWT.Decrypt(req.body.ping), req.doc.ping)) {
        const { _id, account, name } = req.doc
        const token = RSA_JWT.EncryptJWT({
            id: _id,
            account,
            name,
            // 设置有效时间一个月
            outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })
        res.send({
            code: 200,
            body: req.body,
            token,
            msg: "登录成功",
        })
    } else {
        res.send({
            code: 400,
            body: req.body,
            msg: "密码错误",
        })
    }
})

module.exports = router

async function FindUser(account) {
    return new Promise(res => {
        Users.findOne({ account: account }).then(doc => {
            res(doc)
        })
    })
}
