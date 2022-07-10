const { Users } = require("../../model/model")
const router = require("express").Router()

router.get("/searchUser", async (req, res) => {
    const account = req.query.account
    if (account) {
        Users.findOne(
            { account },
            {
                _id: 0,
                name: 1,
                account: 1,
                avatar: 1,
            },
            null,
            (err, doc) => {
                if (doc) {
                    res.send({
                        code: 200,
                        account,
                        user: doc,
                        msg: "查找成功",
                    })
                } else {
                    res.send({
                        code: 404,
                        account,
                        msg: "用户不存在",
                    })
                }
            }
        )
    } else {
        res.send({
            code: 400,
            account,
            msg: "缺失数据",
        })
    }
})

module.exports = router
