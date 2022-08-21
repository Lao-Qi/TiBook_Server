"use strict"
/**
 * 更新用户的名称
 */

const verifyToken = require("../../middleware/verify-token")
const findTokenUser = require("../../middleware/FindTokenAccountUser")
const findTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const RSA_JWT = require("../../lib/keys.js")
const { verification } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.post("/updateName", verifyToken, findTokenUser, findTokenUserInfo, async (req, res) => {
    const { nname } = req.body
    if (!nname) {
        res.send({
            code: 400,
            post: false,
            msg: "参数为空"
        })
        return
    }

    if (!verification(nname, 1, 10)) {
        res.send({
            code: 400,
            post: false,
            data: {
                name: nname
            },
            msg: "名称不合法"
        })
        return
    }

    req.doc.name = nname
    req.userInfoDoc.name = nname

    const { _id, account, avatar } = req.doc
    // 生成一个新的token
    const token = RSA_JWT.EncryptJWT({
        id: _id,
        account,
        name: nname,
        // 设置有效时间一个月
        outTime: Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30),
        avatar
    })

    Promise.all([req.doc.save(), req.userInfoDoc.save()])
        .then(() => {
            res.send({
                code: 200,
                post: true,
                data: {
                    name: nname,
                    ntoken: token
                },
                msg: "修改成功"
            })
        })
        .catch(err => {
            res.send({
                code: 500,
                post: false,
                data: {
                    name: nname
                },
                msg: "修改失败，可能为服务器的原因"
            })
            console.error(err)
        })
})

module.exports = router
