"use strict"
/**
 * 获取对应token用户的好友列表 GET
 */

const VerifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/FriendsList", VerifyToken, FindTokenAccountUser, async (req, res) => {
    // 设置好友的头像地址
    req.doc.friends.forEach(friends => {
        friends.avatar = setAvatarURL(friends.avatar)
    })

    res.send({
        code: 200,
        firendsList: req.doc.friends,
        msg: "获取成功"
    })
})

module.exports = router
