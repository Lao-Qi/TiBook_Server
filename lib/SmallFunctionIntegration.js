/**
 * 一些小功能的函数集成
 */
const { URL } = require("url")

module.exports = {
    /**
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
    setCoverURL(coverInDB) {
        if (coverInDB !== "none") {
            return `${process.env["RESOURCE_ORIGIN"]}:${process.env["POST"]}${process.env["STATIC_RESOURCE_ORIGIN"]}/PersonalizedPictures/${coverInDB}`
        } else {
            return coverInDB
        }
    }
}
