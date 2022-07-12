const router = require("express").Router()
const { UserDetailed, Users } = require("../../model/model")

router.post("/removeUser", async (req, res) => {
    const account = req.body.account
    if (account) {
        RemoveUserDetailed(account)
            .then(account => {
                RemoveUser(account)
                    .then(() => {
                        res.send({
                            code: 200,
                            account,
                            msg: "用户删除成功"
                        })
                    })
                    .catch(err => {
                        res.send({
                            code: 500,
                            account,
                            msg: "基础信息表中用户删除失败"
                        })
                        console.error(err)
                    })
            })
            .catch(err => {
                res.send({
                    code: 500,
                    account,
                    msg: "详细信息表中用户删除失败"
                })
                console.error(err)
            })
    } else {
        res.send({
            code: 404,
            msg: "参数为空"
        })
    }
})

function RemoveUserDetailed(account) {
    return new Promise((res, rej) => {
        UserDetailed.remove({ account }, err => {
            err ? rej(err) : res(account)
        })
    })
}

function RemoveUser(account) {
    return new Promise((res, rej) => {
        Users.remove({ account }, err => {
            err ? rej(err) : res()
        })
    })
}
module.exports = router
