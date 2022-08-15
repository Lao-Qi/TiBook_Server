"use strict"
/**
 * 模糊搜索用户 GET
 *
 * key 搜索关键词 [必须]
 */

const { Users } = require("../../model/model")
const { setAvatarURL } = require("../../lib/SmallFunctionIntegration")
const router = require("express").Router()

/** 搜索全部匹配的用户和群 */
router.get("/SearchUsers", async (req, res) => {
    const keyWord = req.query.key
    if (keyWord) {
        FuzzyFindUsers(keyWord)
            .then(matchUsers => {
                res.send({
                    code: 200,
                    search: true,
                    key: keyWord,
                    data: matchUsers,
                    msg: "查询成功"
                })
            })
            .catch(err => {
                res.send({
                    code: 500,
                    search: false,
                    key: keyWord,
                    msg: "搜索失败，可能为服务器的原因"
                })
                console.error(err)
            })
        // Promise.all([FuzzyFindUsers(keyWorld), FindMatchAccountUser(keyWorld)])
        //     .then(matchUsers => {
        //         res.send({
        //             code: 200,
        //             search: true,
        //             key: keyWorld,
        //             data: {
        //                 matchUsers: matchUsers[0],
        //                 matchAccountUser: matchUsers[1]
        //             },
        //             msg: "查询成功"
        //         })
        //     })
        //     .catch(err => {
        //         res.send({
        //             code: 500,
        //             search: false,
        //             key: keyWorld,
        //             msg: "搜索失败，可能为服务器的原因"
        //         })
        //         console.error(err)
        //     })
    } else {
        res.send({
            code: 404,
            search: false,
            msg: "缺失关键词"
        })
    }
})

// 查找名称匹配的用户
function FuzzyFindUsers(keyWord) {
    return new Promise((res, rej) => {
        Users.find(
            {
                $or: [
                    { name: { $regex: keyWord, $options: "$i" } },
                    { account: { $regex: keyWord, $options: "$i" } },
                    { account: keyWord }
                ]
            },
            {
                _id: 0,
                name: 1,
                account: 1,
                avatar: 1
            },
            (err, docs) => {
                console.log(docs)
                if (err) {
                    rej(err)
                } else if (docs) {
                    for (let i = 0; i < docs.length; i++) {
                        docs[i].avatar = setAvatarURL(docs[i].avatar)
                    }
                    res(docs)
                } else {
                    res([])
                }
            }
        )
    })
}

// // 查询账号匹配的用户
// function FindMatchAccountUser(account) {
//     return new Promise((res, rej) => {
//         Users.findOne(
//             {
//                 account
//             },
//             {
//                 _id: 0,
//                 name: 1,
//                 account: 1,
//                 avatar: 1
//             },
//             (err, doc) => {
//                 if (err) {
//                     rej(err)
//                 } else {
//                     doc && (doc.avatar = setAvatarURL(doc.avatar))
//                     res(doc)
//                 }
//             }
//         )
//     })
// }

module.exports = router
