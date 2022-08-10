"use strict"
/**
 * 修改用户详细信息的接口 POST
 *
 * from 用户要修改的信息表单 [必须](内部的信息为可选，可以不写全部)
 */

const VerifyToken = require("../../middleware/verify-token")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const router = require("express").Router()

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
            post: true,
            msg: "信息修改成功"
        })
    } catch (err) {
        res.send({
            code: 500,
            body: {
                account: req.userInfoDoc.account
            },
            post: false,
            msg: "修改失败，可能为服务器的问题"
        })
        console.error(err)
    }
})
