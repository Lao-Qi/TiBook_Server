"use strict"
/**
 * 跟查询信息相关的接口
 */

const router = require("express").Router()

// 查询匹配用户
const SearchUsers = require("./Search/SearchUsers")
// 查询用户
const SearchUser = require("./Search/SearchUser")
// 查询用户的详细信息
const SearchUserInfo = require("./Search/SearchUserInfo")
// 获取用户的好友列表
const FriendsList = require("./Search/FriendsList")
// 获取token用户的基本信息
const findTokenUser = require("./Search/FindTokenUser")
// 获取token用户的详细信息
const findTokenUserInfo = require("./Search/FindTokenUserInfo")

router.use(SearchUsers) // get  /SearchUsers
router.use(SearchUser) // get  /searchUser
router.use(SearchUserInfo) // get
router.use(FriendsList) // get  /FriendsList
router.use(findTokenUser) // get /findTokenUser
router.use(findTokenUserInfo) // get /findTokenUserInfo
module.exports = router
