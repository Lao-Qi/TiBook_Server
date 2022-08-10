"use strict"
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const { publicEncrypt, privateDecrypt } = require("crypto")

const passphrase = fs.readFileSync(path.join(__dirname, "../keys/passphrase.txt"), "utf8")
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/publicKey.key"), "utf8")
const privateKey = fs.readFileSync(path.join(__dirname, "../keys/privateKey.key"), "utf8")

class RSA_JWT {
    static publicKey = publicKey
    static privateKey = privateKey
    static passphrase = passphrase

    /**
     * @example RSA加密 (公钥加密)
     * @param { Object | String } data
     * @returns { String } 将正常的数据加密成经过RSA加密后再转换为base64编码的字符串
     */
    static Encrypt(data) {
        return publicEncrypt(publicKey, Buffer.from(typeof data === "string" ? data : JSON.stringify(data))).toString(
            "base64"
        )
    }

    /**
     * @example RSA解密 (私钥解密)
     * @param { String } encryptData
     * @returns { String } 如果加密的数据是对象数据类型的会返回经过JSON.stringify后的数据
     */
    static Decrypt(encryptData) {
        try {
            return privateDecrypt(
                {
                    key: privateKey,
                    passphrase: passphrase
                },
                Buffer.from(encryptData, "base64")
            ).toString()
        } catch (err) {
            return err
        }
    }

    /**
     * @example RSA加密Token
     * @param { Object } data
     * @returns { String } 用户数据经过RSA加密后再经过jsonwebtoken的sign加密后面的token
     */
    static EncryptJWT(data) {
        const encryptData = this.Encrypt(data)
        return jwt.sign(
            {
                // 默认一天
                exp: data.outTime || Math.floor(Date.now() + 1000 * 60 * 60 * 24),
                data: encryptData
            },
            this.passphrase
        )
    }

    /**
     * @example RSA解密token
     * @param { String } token
     * @returns { Object } 解密出口的用户数据
     */
    static DecryptJWT(token) {
        try {
            const verifyData = jwt.verify(token, passphrase)
            return JSON.parse(this.Decrypt(verifyData.data))
        } catch (err) {
            console.error(err)
            return false
        }
    }

    /**
     * 验证token是否过期
     * @param { String } token
     * @returns { Boolean } Boolean(token是否过期)
     */
    static VerifyTimeIsOut(token) {
        return token ? jwt.verify(token, passphrase).exp > Date.now() : false
    }
}

module.exports = RSA_JWT
