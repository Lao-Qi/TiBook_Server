/**
 * 一些小功能的函数集成
 */
const { URL } = require("url")
const { Users } = require("../model/model")

module.exports = {
    /**
     * 设置用户的网络地址
     * @param {string} avatarInDB 数据库中的头像文件名
     * @returns {string} 解析好的头像路径
     */
    setAvatarURL(avatarInDB) {
        const avatarURL = new URL(
            `${process.env["RESOURCE_ORIGIN"]}:${process.env["POST"]}${process.env["STATIC_RESOURCE_ORIGIN"]}/avatar/`
        )
        if (avatarInDB === "none") {
            avatarURL.pathname += "defaultAvater.jpg"
        } else {
            avatarURL.pathname += avatarInDB
        }
        return avatarURL.href
    },

    /**
     * 设置个性图片的网络地址
     * @param {string} coverInDB
     * @returns {string}
     */
    setCoverURL(coverInDB) {
        if (coverInDB !== "none") {
            return `${process.env["RESOURCE_ORIGIN"]}:${process.env["POST"]}${process.env["STATIC_RESOURCE_ORIGIN"]}/PPictures/${coverInDB}`
        } else {
            return coverInDB
        }
    },

    /**
     * 验证数据是否合法
     * @param {string} data
     * @param {number} minNumber
     * @param {number} maxNumber
     * @returns { boolean }
     */
    verification(data, minNumber, maxNumber) {
        const xss_reg = new RegExp("[<>\\/]/", "g")
        const string_reg = new RegExp(
            `[a-zA-Z0-9_.*&^%$#@!?)("':;}{\[\]\+=-_~\`|\u4e00-\u9fa5]{${minNumber},${maxNumber}}`
        )
        return xss_reg.test(data) || !string_reg.test(data)
    },

    /**
     * 获取用户
     * @param {string} account
     * @returns {any}
     */
    GetUser(account) {
        return new Promise((res, rej) => {
            Users.findOne(
                {
                    $and: [
                        {
                            account
                        },
                        {
                            del: false
                        }
                    ]
                },
                (err, doc) => {
                    err ? rej(err) : res(doc)
                }
            )
        })
    }
}
