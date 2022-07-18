const { UserDetailed } = require("../model/model")

module.exports = async function (req, res, next) {
    if (req.tokenData.account && req.tokenData.id) {
        FindUserDetailed(req.tokenData)
            .then(doc => {
                if (doc) {
                    req.userInfoDoc = doc
                    next()
                } else {
                    res.send({
                        code: 404,
                        msg: "用户不存在"
                    })
                }
            })
            .catch(err => {
                res.send({
                    code: 500,
                    msg: "用户查询失败"
                })
                console.error(err)
            })
    } else {
        res.send({
            code: 404,
            msg: "用户信息不齐全"
        })
    }
}

function FindUserDetailed({ account, id }) {
    return new Promise((res, rej) => {
        UserDetailed.findOne(
            {
                $and: [
                    {
                        account
                    },
                    {
                        id
                    }
                ]
            },
            (err, doc) => {
                err ? rej(err) : res(doc)
            }
        )
    })
}
