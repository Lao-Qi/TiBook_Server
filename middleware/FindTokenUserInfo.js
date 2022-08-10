const { UserDetailed } = require("../model/model")

// 查找token中对应用户的具体信息
module.exports = async function (req, res, next) {
    const account = req.tokenData.account
    if (account) {
        FindUserDetailed(account)
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
        throw Error("使用FindTokenUserInfo中间件前要先使用verify-token中间件")
    }
}

function FindUserDetailed(account) {
    return new Promise((res, rej) => {
        UserDetailed.findOne({ account }, (err, doc) => {
            err ? rej(err) : res(doc)
        })
    })
}
