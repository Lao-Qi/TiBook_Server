const VerifyToken = require("../../middleware/verify-token")
const FindTokenIDUser = require("../../middleware/FindTokenAccountUser")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.get("/FriendsList", VerifyToken, FindTokenIDUser, async (req, res) => {
    const friendAccountList = req.doc.friends.map(friend => friend.account)
    findUsers(friendAccountList)
        .then(docs => {
            res.send({
                code: 200,
                friendsList: req.doc.friends,
                userList: docs,
                msg: "获取成功"
            })
        })
        .catch(err => {
            console.error(err)
            res.send({
                code: 200,
                friendList: req.doc.friend,
                userList: [],
                msg: "数据库查询失败"
            })
        })
})

async function findUsers(AccountList) {
    return new Promise((res, rej) => {
        Users.find(
            {
                $and: [
                    {
                        account: {
                            $in: AccountList
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
                err ? rej(err) : res(docs)
            }
        )
    })
}

module.exports = router
