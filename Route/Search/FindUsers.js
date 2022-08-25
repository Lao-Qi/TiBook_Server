"use strict"
/**
 * 直接的搜索用户 GET
 *
 * accounts 要查找的用户们的账号数组 [必须]
 */

const verifyToken = require("../../middleware/verify-token")
const { Users } = require("../../model/model")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.post("/findUsers", verifyToken, async (req, res) => {
    const accounts = req.body.accounts
    if (!accounts) {
        res.send({
            code: 404,
            msg: "参数为空"
        })
        return
    }

    if (accounts?.constructor !== Array) {
        res.send({
            code: 400,
            msg: "参数类型错误"
        })
        return
    }

    try {
        const users = await FindUsers(accounts)
        for (const [_, user] of Object.entries(users)) {
            user.avatar = setAvatarURL(user.avatar)
        }

        res.send({
            code: 200,
            data: users,
            msg: "查询成功"
        })
    } catch (err) {
        res.send({
            code: 500,
            msg: "服务器查询错误"
        })
        console.error(err)
    }
})

function FindUsers(accounts) {
    return new Promise((res, rej) => {
        Users.find(
            {
                $and: [
                    {
                        account: {
                            $in: accounts
                        }
                    },
                    {
                        del: false
                    }
                ]
            },
            {
                _id: 0,
                account: 1,
                avatar: 1,
                name: 1
            },
            (err, docs) => {
                err ? rej(err) : res(docs ?? [])
            }
        )
    })
}

module.exports = router
