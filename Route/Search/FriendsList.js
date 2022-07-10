const VerifyToken = require("../../middleware/verify-token")
const FindTokenIDUser = require("../../middleware/FindTokenAccountUser")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.get("/FriendsList", VerifyToken, FindTokenIDUser, async (req, res) => {
    const friendAccountList = req.doc.friends.map((friend) => friend.account)
    const UserList = await findUsers(friendAccountList)
    res.send({
        code: 200,
        friendsList: req.doc.friends,
        userList: UserList ?? [],
        msg: "获取成功",
    })
})

async function findUsers(AccountList) {
    return new Promise((res) => {
        Users.find(
            {
                $and: [
                    {
                        account: {
                            $in: AccountList,
                        },
                    },
                    {
                        del: false,
                    },
                ],
            },
            {
                _id: 1,
                name: 1,
                account: 1,
                avatar: 1,
            },
            (err, docs) => {
                res(docs)
            }
        )
    })
}

module.exports = router
