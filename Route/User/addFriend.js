"use strict"
const VerifyToKen = require("../../middleware/verify-token")
const FindTokenUser = require("../../middleware/FindTokenAccountUser")
const { Users } = require("../../model/model")
const router = require("express").Router()

router.post("/addFriend", VerifyToKen, FindTokenUser, async (req, res) => {
    // 查询要添加的好友
    GetWantAddUser(req.body.account)
        .then((UserWantAddFriend) => {
            UserWantAddFriend._doc["AddTime"] = Date.now()
            req.doc.friends.push(UserWantAddFriend._doc)
            req.doc
                .save()
                .then(() => {
                    res.send({
                        code: 200,
                        UserID: req.tokenData.id,
                        friend: UserWantAddFriend._doc,
                        msg: "好友添加成功",
                    })
                })
                .catch((err) => {
                    res.send({
                        code: 500,
                        User: req.tokenData.account,
                        friend: req.body.account,
                        msg: "好友添加失败",
                    })
                    console.error(err)
                })
            // 修改该用户在数据库的friends字段
            // UpdateUserFriendList(req.tokenData.account, UserWantAddFriend).then(addTime => {
            // 	res.send({
            // 		code: 200,
            // 		UserID: req.tokenData.id,
            // 		friend: {
            // 			...UserWantAddFriend,
            // 			AddTime: addTime
            // 		},
            // 		msg: "好友添加成功"
            // 	})
            // }).catch(err => {
            // 	res.send({
            // 		code: 500,
            // 		User: req.tokenData.account,
            // 		friend: req.body.account,
            // 		msg: "好友添加失败"
            // 	})
            // 	console.error(err);
            // })
        })
        .catch((err) => {
            res.send({
                code: 404,
                Users: req.tokenData.account,
                friend: req.body.account,
                msg: "好友不存在",
            })
            console.error(err)
        })
})

// 查询好友是否存在
function GetWantAddUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                $and: [
                    {
                        account,
                    },
                    {
                        del: false,
                    },
                ],
            },
            {
                _id: 0,
                name: 1,
                account: 1,
                avatar: 1,
            },
            (err, doc) => {
                err || !doc ? rej(err) : res(doc)
            }
        )
    })
}

// 修改好友列表
// async function UpdateUserFriendList(userAccount, Friend) {
// 	return new Promise((res, rej) => {
// 		const AddTime = Date.now();
// 		Users.updateOne({
// 			account: userAccount
// 		}, {
// 			$addToSet: {
// 				friends: {
// 					...Friend,
// 					AddTime
// 				}
// 			},
// 		}, null,(err) => {
// 			err ? rej(err) : res(AddTime);
// 		})
// 	})
// }

module.exports = router
