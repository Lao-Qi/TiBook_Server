"use strict"
/**
 * 获取token中的基本信息
 *
 * 这个接口主要是用于替代前端后台的用户基本信息本地存储，让用户的基本信息和服务器保持一致
 */
const verifyToken = require("../../middleware/verify-token")
const FindTokenUser = require("../../middleware/FindTokenAccountUser")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/findTokenUser", verifyToken, FindTokenUser, (req, res) => {
    res.send({
        code: 200,
        data: {
            account: req.doc.account,
            avatar: setAvatarURL(req.doc.avatar),
            name: req.doc.name,
            id: req.doc.id
        },
        msg: "获取成功"
    })
})

module.exports = router
