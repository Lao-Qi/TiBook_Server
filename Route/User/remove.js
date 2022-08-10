"use strict"
/**
 * 删除用户的接口，此接口为测试接口，因此没有写的那么严
 *
 * account 要删除的用户的账号  [必须]
 */

const { UserDetailed, Users } = require("../../model/model")
const router = require("express").Router()

router.post("/removeUser", async (req, res) => {
    const account = req.body.account
    if (!account) {
        res.send({
            code: 404,
            msg: "参数为空"
        })
        return
    }

    try {
        await RemoveUserDetailed(account)
        await RemoveUser(account)
        res.send({
            code: 200,
            body: {
                account: account
            },
            msg: "添加成功"
        })
    } catch {
        res.send({
            code: 500,
            account,
            msg: "删除失败"
        })
        console.error(err)
    }
})

function RemoveUserDetailed(account) {
    return new Promise((res, rej) => {
        UserDetailed.deleteOne({ account }, err => {
            err ? rej(err) : res(account)
        })
    })
}

function RemoveUser(account) {
    return new Promise((res, rej) => {
        Users.deleteOne({ account }, err => {
            err ? rej(err) : res()
        })
    })
}
module.exports = router
