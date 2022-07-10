const { Message } = require("../../model/model")
const FindTokenIDUser = require("../../middleware/FindTokenAccountUser")
const verifyToken = require("../../middleware/verify-token")
const router = require("express").Router()

router.get("/GetMessageList", verifyToken, FindTokenIDUser, (req, res) => {})

// 查询跟用户有关的聊天记录
async function FindUserMessage(account) {
    new Promise((res) => {
        Message.findOne(
            {
                $or: [
                    {
                        to: account,
                    },
                    {
                        from: account,
                    },
                ],
            },
            (err, docs) => {
                res(docs)
            }
        )
    })
}
