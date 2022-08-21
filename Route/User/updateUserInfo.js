"use strict"
/**
 * 修改用户详细信息的接口 POST
 *
 * from 用户要修改的信息表单 [必须](内部的信息为可选，可以不写全部)
 */

const VerifyToken = require("../../middleware/verify-token")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const router = require("express").Router()

router.post("/updateUserTextInfo", VerifyToken, FindTokenUserInfo, async (req, res) => {
    const from = req.body.from
    const userInfoDoc = req.userInfoDoc

    if (!Object.keys(from).length) {
        res.send({
            code: 304,
            post: false,
            msg: "表单内容为空"
        })
        return
    }

    from?.name && (userInfoDoc.name = from.name)
    from?.age && (userInfoDoc.age = from.age)
    from?.gender && (userInfoDoc.gender = from.gender)
    from?.birth && (userInfoDoc.birth = from.birth)
    from?.address && (userInfoDoc.address = from.address)
    from?.signature && (userInfoDoc.signature = from.signature)

    userInfoDoc
        .save()
        .then(() => {
            res.send({
                code: 200,
                post: true,
                msg: "信息修改成功"
            })
        })
        .catch(err => {
            res.send({
                code: 500,
                post: false,
                msg: "修改失败，可能为服务器的问题"
            })
            console.error(err)
        })
})

module.exports = router
