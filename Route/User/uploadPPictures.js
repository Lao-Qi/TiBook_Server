"use strict"
/**
 * 修改用户的个性图片   POST
 *
 * 前端使用流的方式通过设置body中的type来选择阶段
 * 不同阶段对应流式上传文件的不同过程
 *
 */
const verifyToken = require("../../middleware/verify-token")
const FindTokenUserInfo = require("../../middleware/FindTokenUserInfo")
const uploadImage = require("../../middleware/uploadImage")
const { setCoverURL } = require("../../lib/SmallFunctionIntegration")
const { rm } = require("fs")
const { join } = require("path")
const router = require("express").Router()

router.post(
    "/uploadPPictures",
    verifyToken,
    async (req, _, next) => {
        req.imageuse = "PPictures"
        next()
    },
    uploadImage,
    FindTokenUserInfo
)

router.post("/uploadPPictures", async (req, res) => {
    if (req.userInfoDoc.cover !== req.imageName && req.userInfoDoc.cover !== "none") {
        rm(
            join(__dirname, `../../${process.env["STATIC_RESOURCE_ORIGIN"]}/PPictures/${req.userInfoDoc.cover}`),
            err => {
                if (err) {
                    console.error(err.message)
                }
            }
        )
    }

    req.userInfoDoc.cover = req.imageName

    req.userInfoDoc
        .save()
        .then(() => {
            res.send({
                code: 200,
                post: true,
                path: setCoverURL(req.imageName),
                msg: "上传成功"
            })
        })
        .catch(err => {
            res.send({
                code: 500,
                post: false,
                msg: "上传失败，可能为服务器的原因"
            })
            console.error(err)
        })
})

module.exports = router
