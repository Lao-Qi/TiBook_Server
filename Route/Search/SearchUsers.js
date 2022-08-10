"use strict"
/**
 * 模糊搜索用户 GET
 *
 * key 搜索关键词 [必须]
 */

const { Users } = require("../../model/model")
const router = require("express").Router()

/** 搜索全部匹配的用户和群 */
router.get("/SearchUsers", async (req, res) => {
    const keyWorld = req.query.key
    if (keyWorld) {
        Promise.all([FindRegexNameUsers(keyWorld), FindRegexAccountUsers(keyWorld)])
            .then(matchUsers => {
                res.send({
                    code: 200,
                    search: true,
                    key: keyWorld,
                    data: {
                        RegexName: matchUsers[0],
                        RegexAccount: matchUsers[1]
                    },
                    msg: "查询成功"
                })
            })
            .catch(err => {
                res.send({
                    code: 500,
                    search: false,
                    key: keyWorld,
                    msg: "搜索失败，可能为服务器的原因"
                })
                console.error(err)
            })

        res.send({
            code: 200,
            search: true,
            key: keyWorld,
            List: matchResultList
        })
    } else {
        res.send({
            code: 404,
            search: false,
            msg: "缺失关键词"
        })
    }
})

// 查找名称匹配的用户
function FindRegexNameUsers(keyWorld) {
    return new Promise((res, rej) => {
        Users.find(
            {
                name: {
                    $regex: keyWorld
                }
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

// 查询账号匹配的用户
async function FindRegexAccountUsers(account) {
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
