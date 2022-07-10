const { Users } = require("../../model/model")
const verifyToken = require("../../middleware/verify-token")

const { writeFileSync } = require("fs")
const { win32: path } = require("path")
const router = require("express").Router()

/** base64方式上传头像文件 */
router.post("/uploadAvatar", verifyToken, async (req, res) => {
    const id = req.tokenData.id
    const body = req.body

    if (id && body.img && body.ext) {
        // 修改用户头像名称
        const fileName = `${id}${body.ext}`
        const doc = await AccountFindByID(id)
        // 用户不存在时，doc为空
        if (doc) {
            doc.avatar = fileName
            doc.save()
            writeFileSync(
                path.join(__dirname, `../../static/user/avatar/${fileName}`),
                body.img,
                "base64"
            )
            res.send({
                code: 200,
                id,
                body,
                post: true,
                msg: "上传成功",
            })
        } else {
            res.send({
                code: 404,
                id,
                body,
                post: false,
                msg: "用户不存在",
            })
        }
    } else {
        res.send({
            code: 400,
            id: id,
            body,
            post: false,
            msg: "数据缺失",
        })
    }
})

module.exports = router

async function AccountFindByID(id) {
    return new Promise((res) => {
        Users.findById(id).then((doc) => {
            res(doc)
        })
    })
}
