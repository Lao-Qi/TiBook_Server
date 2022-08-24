"use strict"
/**
 * 用户添加好友接口 POST
 *
 * account 要添加的好友账号 [必须]
 */

const VerifyToKen = require("../../middleware/verify-token")
const FindTokenUser = require("../../middleware/FindTokenAccountUser")
const { GetUser } = require("../../lib/SmallFunctionIntegration")
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
            if (wantAddFriend) {
                // 用户和用户要添加的好友同时添加，保持同步
                const AddTime = Date.now()
                req.doc.friends.push({
                    id: wantAddFriend._id,
                    AddTime
                })

                wantAddFriend.friends.push({
                    id: req.doc._id,
                    AddTime
                })

                Promise.all([req.doc.save(), wantAddFriend.save()])
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
            } else {
                res.send({
                    code: 404,
                    add: false,
                    msg: "好友不存在"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 500,
                add: false,
                msg: "好友查询失败，可能是服务器的问题"
            })
            console.error(err)
        })
})

module.exports = router
