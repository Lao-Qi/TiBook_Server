"use strict"
/**
 * 获取token中的基本信息
 *
 * 这个接口主要是用于替代前端后台的用户基本信息本地存储，让用户的基本信息和服务器保持一致
 */
const verifyToken = require("../../middleware/verify-token")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/findTokenUser", verifyToken, (req, res) => {
    res.send({
        code: 200,
        data: {
            account: req.tokenData.account,
            avatar: setAvatarURL(req.tokenData.avatar),
            name: req.tokenData.name,
            id: req.tokenData.id
        },
        msg: "获取成功"
    })
})

module.exports = router
