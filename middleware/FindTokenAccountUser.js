const { Users } = require("../model/model")

module.exports = async function FindTokenIDUser(req, res, next) {
    const account = req.tokenData.account ?? req.body.account
    if (account) {
        FindUser(req.tokenData.account)
            .then(doc => {
                if (doc) {
                    req.doc = doc
                    next()
                } else {
                    res.send({
                        code: 400,
                        data: {
                            account
                        },
                        msg: "用户不存在"
                    })
                }
            })
            .catch(err => {
                res.send({
                    code: 500,
                    data: {
                        account
                    },
                    msg: "查询失败"
                })
                console.error(err)
            })
    } else {
        res.send({
            code: 404,
            msg: "账户为空"
        })
    }
}

async function FindUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                account
            },
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}
