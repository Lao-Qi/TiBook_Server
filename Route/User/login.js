"use strict"
/**
 * 登录接口
 *
 * account  要登录的用户账号     [必须]
 * ping 经过服务器公钥RSA加密后的登录的密码   [必须]
 *
 */
const bcryptjs = require("bcryptjs")
const RSA_JWT = require("../../lib/keys.js")
const { Users } = require("../../model/model")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

// 检测数据完整性
router.post("/login", async (req, res, next) => {
    if (!req.body.ping) {
        res.send({
            code: 400,
            msg: "Ping字段为空"
        })
        return
    }
    if (!req.body.account) {
        res.send({
            code: 400,
            msg: "账号字段为空"
        })
        return
    }
    FindUser(req.body.account)
        .then(doc => {
            if (doc) {
                req.doc = doc
                next()
            } else {
                res.send({
                    code: 404,
                    msg: "用户不存在"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 500,
                msg: "查询用户时报错，可能是服务器的原因"
            })
            console.error(err)
        })
})

router.post("/login", async (req, res) => {
    if (bcryptjs.compareSync(RSA_JWT.Decrypt(req.body.ping), req.doc.ping)) {
        const { _id, account, name, avatar } = req.doc
        // 设置用户的token
        const token = RSA_JWT.EncryptJWT({
            id: _id,
            account,
            name,
            // 设置有效时间一个月
            outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
            avatar
        })

        res.send({
            code: 200,
            data: {
                userDoc: {
                    name,
                    account,
                    avatar: setAvatarURL(avatar),
                    id: _id
                },
                token
            },
            msg: "登录成功"
        })
    } else {
        res.send({
            code: 200,
            msg: "密码错误"
        })
    }
})

module.exports = router

async function FindUser(account) {
    return new Promise((res, rej) => {
        Users.findOne({ account }).then(res).catch(rej)
    })
}
