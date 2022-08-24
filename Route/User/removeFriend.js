"use strict"
/**
 * 删除好友的接口 [POST]
 *
 * account 要删除的好友的转换
 */

const VerifyToKen = require("../../middleware/verify-token")
const FindTokenUser = require("../../middleware/FindTokenAccountUser")
const { GetUser } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.post("/removeFriend", VerifyToKen, FindTokenUser, async (req, res) => {
    if (!req.body.account) {
        res.send({
            code: 404,
            post: true,
            msg: "好友账号为空"
        })
    }

    try {
        const friendInfo = await GetUser(req.body.account)
        const friendIndex = req.doc.friends.findIndex(friend => friend.id === friendInfo._id)
        req.doc.friends.splice(friendIndex, 1)

        await req.doc.save()
        res.send({
            code: 200,
            post: true,
            msg: "删除成功"
        })
    } catch (err) {
        res.send({
            code: 500,
            post: true,
            msg: "服务器查找错误"
        })
        console.error(err)
    }
})

module.exports = router
