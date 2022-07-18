const router = require("express").Router()
const { UserDetailed } = require("../../model/model")
const verifyToken = require("../../middleware/verify-token")

router.get("/searchUserInfo", verifyToken, async (req, res) => {
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
                    data: doc,
                    msg: "查询成功"
                })
            } else {
                res.send({
                    code: 404,
                    query: req.query,
                    data: doc,
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
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}

module.exports = router
