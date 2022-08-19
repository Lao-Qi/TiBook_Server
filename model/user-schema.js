"use strict"

const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        // 名称
        name: {
            type: String,
            required: [true, "姓名字段不能为空"],
            minlength: [1, "姓名长度不能小于2"],
            maxlength: [20, "姓名长度不能超过20"]
        },
        // 加密过的密码
        ping: {
            type: String,
            required: [true, "Ping字段不能为空"]
        },
        // 账号
        account: {
            type: String,
            required: [true, "账号不能为空"],
            minlength: [6, "账号的长度不能小于10"],
            maxLength: [24, "账号长度不能超过20"]
        },
        // 头像路径
        avatar: {
            type: String,
            default: "none"
        },
        // 用户ip
        ip: {
            type: String,
            required: true
        },
        // 好友集合
        friends: {
            type: [
                {
                    // 好友在user-schema集合中的_id
                    id: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    },
                    // 好友添加时间
                    AddTime: {
                        type: Date,
                        required: true,
                        default: Date.now()
                    }
                }
            ],
            default: []
        },
        // 用户所用的系统 或 浏览器内核
        System: String,
        // 注册时间
        RegTime: {
            type: Date,
            required: true,
            default: Date.now()
        },
        // 是否被删除
        del: {
            type: Boolean,
            default: false
        }
    },
    {
        // 返回一个虚拟的_id获取路径
        id: true,
        // __v字段
        versionKey: false
    }
)

module.exports = UserSchema
