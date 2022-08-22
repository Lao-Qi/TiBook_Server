"use strict"
/**
 * 获取对应token用户的好友列表并包括好友的基本用户信息 GET
 */
const VerifyToken = require("../../middleware/verify-token")
const FindTokenAccountUser = require("../../middleware/FindTokenAccountUser")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.get("/FriendsList", VerifyToken, FindTokenAccountUser, async (req, res) => {
    if (!req.doc.friends.length) {
        res.send({
            code: 200,
            data: [],
            msg: "查询成功"
        })
        return
    }

    try {
        const AddTimeMap = {}
        const friendsInfoList = await findUsers(
            req.doc.friends.map(friend => {
                AddTimeMap[friend.id] = friend.AddTime
                return friend.id
            })
        )

        friendsInfoList.forEach(friendInfo => {
            friendInfo.avatar = setAvatarURL(friendInfo.avatar)
            friendInfo.AddTime = AddTimeMap[friendInfo._id.toString()]
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

function findUsers(idList) {
    return new Promise((res, rej) => {
        Users.find(
            {
                $and: [
                    {
                        _id: {
                            $in: idList
                        }
                    },
                    {
                        del: false
                    }
                ]
            },
            {
                _id: 1,
                name: 1,
                account: 1,
                avatar: 1
            },
            (err, docs) => {
                err ? rej(err) : res(JSON.parse(JSON.stringify(docs)) ?? [])
            }
        )
    })
}

module.exports = router
