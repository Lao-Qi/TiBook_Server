"use strict"
/**
 * 使用未过期的token登录的接口
 */

const verifyToken = require("../../middleware/verify-token")
const findTokenUser = require("../../middleware/FindTokenAccountUser")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const RSA_JWT = require("../../lib/keys")
const router = require("express").Router()

router.post("/tokenLogin", verifyToken, findTokenUser, (req, res) => {
    const { id, account, name, avatar } = req.doc
    // 生成一个新的token
    const token = RSA_JWT.EncryptJWT({
        id,
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
                id,
                account,
                name,
                avatar: setAvatarURL(avatar)
            },
            token
        },
        msg: "登录成功"
    })
})

module.exports = router
