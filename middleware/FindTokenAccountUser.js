const { Users } = require("../model/model")

module.exports = async function FindTokenIDUser(req, res, next) {
    FindUser(req.tokenData.account)
        .then((doc) => {
            req.doc = doc
            next()
        })
        .catch((err) => {
            if (err) {
                res.send({
                    code: 500,
                    msg: "查询失败",
                })
                console.error(err)
            } else {
                res.send({
                    code: 404,
                    account: req.tokenData.account,
                    msg: "认证的用户不存在",
                })
            }
        })
}

async function FindUser(account) {
    return new Promise((res, rej) => {
        Users.findOne(
            {
                account,
            },
            (err, doc) => {
                err || !doc ? rej(err) : res(doc)
            }
        )
    })
}
