"use strict"
const bcrypt = require("bcryptjs")
const RSA_JWT = require("../../lib/keys.js")
const { Users, UserDetailed } = require("../../model/model")
const router = require("express").Router()

router.post("/register", async (req, res, next) => {
    const body = req.body
    if (body.name && body.ping && body.account) {
        FindAccount(body.account)
            .then(isExist => {
                if (!isExist) {
                    // 验证用户数据是否合法
                    if (verification(body.name, 1, 10) && verification(body.account, 6, 14)) {
                        next()
                    } else {
                        res.send({
                            code: 400,
                            body,
                            msg: "名称或账号不合法"
                        })
                    }
                } else {
                    res.send({
                        code: 400,
                        body,
                        msg: "账号已存在"
                    })
                }
            })
            .catch(err => {
                res.send({
                    code: 500,
                    body,
                    msg: "账号查找失败，可能是服务器内部原因"
                })
                console.error(err)
            })
    } else {
        res.send({
            code: 404,
            body,
            msg: "缺失数据"
        })
    }
})

router.post("/register", async (req, res) => {
    const body = req.body
    // 用私钥解除用户密码
    const PingCode = RSA_JWT.Decrypt(body.ping)
    Users.create({
        name: body.name,
        account: body.account,
        ping: bcrypt.hashSync(PingCode),
        ip: req.ip,
        System: body.type || req.headers["user-agent"]
    })
        .then(userDoc => {
            UserDetailed.create({
                name: body.name,
                account: body.account
            })
                .then(() => {
                    res.send({
                        code: 200,
                        data: {
                            name: body.name,
                            account: body.account,
                            body: {
                                name: userDoc.name,
                                account: userDoc.account,
                                avatar: userDoc.avatar
                            }
                        },
                        msg: "注册成功"
                    })
                })
                .catch(err => {
                    res.send({
                        code: 500,
                        data: {
                            name: body.name,
                            account: body.account
                        },
                        msg: "详细信息表注册失败"
                    })
                    console.error(err)
                })
        })
        .catch(err => {
            res.send({
                code: 500,
                data: {
                    name: body.name,
                    account: body.account
                },
                msg: "基础信息表注册失败"
            })
            console.log(err)
        })
})

module.exports = router

// 验证用户名或账号是否合法
function verification(data, minNumber, maxNumber) {
    const xss_reg = new RegExp("[<>\\/]/", "g")
    const string_reg = new RegExp(`[a-zA-Z0-9_.*&^%$#@!?)("':;}{\[\]\+=-_~\`|\u4e00-\u9fa5]{${minNumber},${maxNumber}}`)
    return xss_reg.test(data) || !string_reg.test(data)
}

// 查询账号是否存在
function FindAccount(account) {
    return new Promise((res, rej) => {
        Users.findOne({ account }, (err, doc) => {
            err ? rej(err) : res(doc)
        })
    })
}
