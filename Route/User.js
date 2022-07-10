"use strict"
const router = require("express").Router()
// 上传头像
const uploadAvatar = require("./User/uploadAvatar")
// 登录
const login = require("./User/login")
// 注册
const register = require("./User/register")
// 添加好友
const addFriend = require("./User/addFriend")

// 注册路由
router.use(uploadAvatar) // post /uploadAvatar
router.use(login) // post /login
router.use(register) // post /register
router.use(addFriend) // post /addFriend

module.exports = router
