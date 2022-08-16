"use strict"
/**
 * 通过verify-token中间件返回的tokenData中的account字段获取用户的基本信息，并绑定到req.doc属性上
 */
const { Users } = require("../model/model")

module.exports = async function FindTokenIDUser(req, res, next) {
    const account = req.tokenData.account
    if (account) {
        FindUser(account)
            .then(doc => {
                if (doc) {
                    req.doc = doc
                    next()
                } else {
                    res.send({
                        code: 400,
                        data: {
                            account
                        },
                        msg: "用户不存在"
                    })
                }
            })
            .catch(err => {
                res.send({
                    code: 500,
                    data: {
                        account
                    },
                    msg: "查询失败"
                })
                console.error(err)
            })
    } else {
        throw Error("使用FindTokenAccountUser中间件前要先使用verify-token中间件")
    }
}

function FindUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                account
            },
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}
