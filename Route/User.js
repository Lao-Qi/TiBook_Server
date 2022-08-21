"use strict"
/**
 * 用户信息操作相关的接口
 */

const router = require("express").Router()
// 上传头像
const uploadAvatar = require("./User/uploadAvatar")
// 登录
const login = require("./User/login")
// token登录
const tokenLogin = require("./User/tokenLogin")
// 注册
const register = require("./User/register")
// 删除
const reomve = require("./User/remove")
// 添加好友
const addFriend = require("./User/addFriend")
// 更新用户的个性图片
const uploadPPictures = require("./User/uploadPPictures")
// 更新用户的详细信息
const updateUserTextInfo = require("./User/updateUserInfo")
// 修改用户的账号
const updateAccount = require("./User/updateAccount")
// 修改用户的名称
const updateName = require("./User/updateName")

// 注册路由
router.use(uploadAvatar) // post /uploadAvatar
router.use(uploadPPictures) // post /uploadPPictures
router.use(login) // post /login
router.use(tokenLogin) // post /tokenLogin
router.use(register) // post /register
router.use(addFriend) // post /addFriend
router.use(reomve) // post /removeUser
router.use(updateUserTextInfo) // post /updateUserTextInfo
router.use(updateAccount) // post /updateAccount
router.use(updateName) // post /updateName

module.exports = router
