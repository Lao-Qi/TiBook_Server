"use strict"

const mongoose = require("mongoose")

const UserDetailedSchema = new mongoose.Schema(
    {
        // 账号
        account: {
            type: String,
            required: [true, "账号不能为空"],
            minlength: [6, "账号的长度不能小于10"],
            maxLength: [24, "账号长度不能超过20"]
        },
        // 名称
        name: {
            type: String,
            required: [true, "姓名字段不能为空"],
            minlength: [1, "姓名长度不能小于2"],
            maxlength: [20, "姓名长度不能超过20"]
        },
        mail: {
            type: String,
            default: "none"
        },
        // 头像路径
        avatar: {
            type: String,
            default: "/resource/defaultAvater.jpg"
        },
        // 年龄
        age: {
            type: Number,
            default: 0
        },
        // 性别
        gender: {
            type: String,
            default: "none"
        },
        // 出生日期
        birth: {
            type: String,
            default: "none"
        },
        // 地址
        address: {
            type: String,
            default: "none"
        },
        // 个性签名
        signature: {
            type: String,
            default: "none"
        },
        // 封面
        cover: {
            type: String,
            default: "none"
        },
        // 是否被删除
        del: {
            type: Boolean,
            default: false
        }
    },
    {
        id: true,
        versionKey: false
    }
)

module.exports = UserDetailedSchema
