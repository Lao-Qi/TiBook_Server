"use strict"
/**
 * 用户添加好友接口 POST
 *
 * account 要添加的好友账号 [必须]
 */

const VerifyToKen = require("../../middleware/verify-token")
const FindTokenUser = require("../../middleware/FindTokenAccountUser")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.post("/addFriend", VerifyToKen, FindTokenUser, async (req, res) => {
    const account = req.body.account
    if (!account) {
        res.send({
            code: 400,
            add: false,
            msg: "参数缺失"
        })
        return
    }
    // 查询要添加的好友
    GetUser(req.body.account)
        .then(wantAddFriend => {
            console.log(wantAddFriend)
            req.doc.friends.push({
                id: wantAddFriend._id,
                name: wantAddFriend.name,
                account: wantAddFriend.account,
                avatar: wantAddFriend.avatar,
                AddTime: Date.now()
            })

            req.doc
                .save()
                .then(() => {
                    res.send({
                        code: 200,
                        add: true,
                        data: {
                            addAccount: wantAddFriend.account
                        },
                        msg: "好友添加成功"
                    })
                })
                .catch(err => {
                    res.send({
                        code: 500,
                        add: false,
                        data: {
                            addAccount: wantAddFriend.account
                        },
                        msg: "好友添加失败，可能是服务器的原因"
                    })
                    console.error(err)
                })
        })
        .catch(err => {
            res.send({
                code: 404,
                add: false,
                msg: "好友不存在"
            })
            console.error(err)
        })
})

/**
 * 获取用户
 * @param {string} account
 * @returns {any}
 */
function GetUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                $and: [
                    {
                        account
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
            (err, doc) => {
                err || !doc ? rej(err) : res(doc)
            }
        )
    })
}

module.exports = router
