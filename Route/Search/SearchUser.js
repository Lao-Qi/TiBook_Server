"use strict"
/**
 * 搜索用户 GET
 *
 * account 要查询的用户 [必须]
 */

const { Users } = require("../../model/model")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

router.get("/SearchUser", async (req, res) => {
    const account = req.query.account
    if (!account) {
        res.send({
            code: 400,
            msg: "缺失数据"
        })
        return
    }

    FindUser(account)
        .then(doc => {
            res.send({
                code: 200,
                body: {
                    account: req.query.account
                },
                data: {
                    name: doc.name,
                    account: doc.account,
                    avatar: setAvatarURL(doc.avatar)
                },
                msg: "查询成功"
            })
        })
        .catch(err => {
            res.send({
                code: 500,
                body: {
                    account: req.query.account
                },
                msg: "查询失败，可能为后端的原因"
            })
            console.error(err)
        })
})

function FindUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                account
            },
            {
                _id: 0,
                name: 1,
                account: 1,
                avatar: 1
            },
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}

module.exports = router
