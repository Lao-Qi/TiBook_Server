"use strict"
/**
 * 修改用户的账号
 */

const verifyToken = require("../../middleware/verify-token")
const findTokenUser = require("../../middleware/FindTokenAccountUser")
const findTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const RSA_JWT = require("../../lib/keys.js")
const { verification } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.post("/updateAccount", verifyToken, findTokenUser, findTokenUserInfo, async (req, res) => {
    const { naccount } = req.body
    if (!naccount) {
        res.send({
            code: 400,
            msg: "参数为空"
        })
        return
    }

    if (!verification(naccount, 6, 14)) {
        res.send({
            code: 400,
            data: {
                account: naccount
            },
            msg: "账号不合法"
        })
        return
    }

    req.doc.account = naccount
    req.userInfoDoc.account = naccount

    const { _id, name, avatar } = req.doc
    // 生成一个新的token
    const token = RSA_JWT.EncryptJWT({
        id: _id,
        account: naccount,
        name,
        // 设置有效时间一个月
        outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
        avatar
    })

    Promise.all([req.doc.save(), req.userInfoDoc.save()])
        .then(() => {
            res.send({
                code: 200,
                data: {
                    account: naccount,
                    ntoken: token
                },
                msg: "修改成功"
            })
        })
        .catch(err => {
            res.send({
                code: 500,
                data: {
                    account: naccount
                },
                msg: "修改失败，可能为服务器的原因"
            })
            console.error(err)
        })
})

module.exports = router
