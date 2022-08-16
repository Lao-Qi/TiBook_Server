"use strict"
/**
 * 验证请求头中的token中间件
 *
 * 过期了就驳回，没过期就在req.tokenData上挂载token中的数据
 */
const RSA_JWT = require("../lib/keys.js")

module.exports = async function verifyToken(req, res, next) {
    const token = req.headers.token
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
