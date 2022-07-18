const router = require("express").Router()
const VerifyToken = require("../../middleware/verify-token")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")

router.post("/userUpdateInfo", VerifyToken, FindTokenUserInfo, async (req, res) => {
    const from = req.body.from
    const userInfoDoc = req.userInfoDoc
    try {
        userInfoDoc.name = from?.name ? from.name : userInfoDoc.name
        userInfoDoc.age = from?.age ? from.age : userInfoDoc.age
        userInfoDoc.gender = from?.gender ? from.gender : userInfoDoc.gender
        userInfoDoc.birth = from?.birth ? from.birth : userInfoDoc.birth
        userInfoDoc.address = from?.address ? from.address : userInfoDoc.address
        userInfoDoc.signature = from?.signature ? from.signature : userInfoDoc.signature

        await userInfoDoc.save()
        res.send({
            code: 200,
            body: {
                account: req.userInfoDoc.account
            },
            msg: "信息修改成功"
        })
    } catch (err) {
        res.send({
            code: 500,
            body: {
                account: req.userInfoDoc.account
            },
            msg: "修改失败，可能为服务器的问题"
        })
        console.error(err)
    }
})
