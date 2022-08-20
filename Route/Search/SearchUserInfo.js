"use strict"
/**
 * 搜索用户并返回详细信息 GET
 *
 * account 要搜索的用户的账号 [必须]
 */

const verifyToken = require("../../middleware/verify-token")
const { UserDetailed } = require("../../model/model")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/userInfo", verifyToken, async (req, res) => {
    if (!req.query.account) {
        res.send({
            code: 404,
            msg: "参数为空"
        })
        return
    }

    FindUserDetailed(req.query.account)
        .then(doc => {
            if (doc) {
                res.send({
                    code: 200,
                    query: req.query,
                    data: {
                        ...doc._doc,
                        avatar: setAvatarURL(doc.avatar),
                        cover: setCoverURL(doc.cover)
                    },
                    msg: "查询成功"
                })
            } else {
                res.send({
                    code: 404,
                    query: req.query,
                    msg: "查询的用户不存在"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 500,
                msg: "用户查询失败，可能是后端的问题"
            })
            console.error(err)
        })
})

function FindUserDetailed(account) {
    return new Promise((res, rej) => {
        UserDetailed.findOne(
            {
                account
            },
            {
                _id: 0,
                del: 0
            },
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}

module.exports = router
