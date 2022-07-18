const RSA_JWT = require("../lib/keys.js")

// 验证token
module.exports = async function verifyToken(req, res, next) {
    const token = req.headers["token"]
    if (token) {
        if (RSA_JWT.VerifyTimeIsOut(token)) {
            req.tokenData = RSA_JWT.DecryptJWT(token)
            next()
        } else {
            res.send({
                code: 400,
                msg: "认证已过期，请重新登录"
            })
        }
    } else {
        res.send({
            code: 400,
            msg: "token不存在"
        })
    }
}
