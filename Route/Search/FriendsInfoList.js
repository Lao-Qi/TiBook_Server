"use strict"
/**
 * 获取对应token用户的好友列表并包括好友的详细信息 GET
 */
const VerifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.get("/FriendsInfoList", VerifyToken, FindTokenAccountUser, async (req, res) => {
    if (!req.doc.friends.length) {
        res.send({
            code: 200,
            data: [],
            msg: "查询成功"
        })
        return
    }

    const friendsAccount = req.doc.friends.map(friend => friend.account)
    try {
        const friendsInfoList = await findUsers(friendsAccount)

        friendsInfoList.forEach(friendInfo => {
            friendsInfoList.avatar = setAvatarURL(friendInfo.avatar)
        })

        res.send({
            code: 200,
            data: friendsInfoList,
            msg: "查询成功"
        })
    } catch (err) {
        res.send({
            code: 500,
            msg: "查询失败，可能为服务器的原因"
        })
        console.error(err)
    }
})

function findUsers(AccountList) {
    return new Promise((res, rej) => {
        Users.find(
            {
                $and: [
                    {
                        account: {
                            $in: AccountList
                        }
                    },
                    {
                        del: false
                    }
                ]
            },
            {
                _id: 0,
                name: 1,
                account: 1,
                avatar: 1
            },
            (err, docs) => {
                err ? rej(err) : res(docs ?? [])
            }
        )
    })
}

module.exports = router
