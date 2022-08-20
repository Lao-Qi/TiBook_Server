"use strict"
/**
 * 获取token中的基本信息
 *
 * 这个接口主要是用于替代前端后台的用户基本信息本地存储，让用户的基本信息和服务器保持一致
 */
const verifyToken = require("../../middleware/verify-token")
const FIndTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const { setAvatarURL, setCoverURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/findTokenUserInfo", verifyToken, FIndTokenUserInfo, (req, res) => {
    res.send({
        code: 200,
        data: {
            ...req.userInfoDoc._doc,
            avatar: setAvatarURL(req.userInfoDoc.avatar),
            cover: setCoverURL(req.userInfoDoc.cover)
        },
        msg: "获取成功"
    })
})

module.exports = router
