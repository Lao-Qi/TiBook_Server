"use strict"

const mongoose = require("mongoose")

const message = new mongoose.Schema(
    {
        // 接收方账号
        from: {
            type: String,
            required: true
        },
        // 发送方账号
        to: {
            type: String,
            required: true
        },
        // 消息格式
        message_type: String,
        // 发送时间
        sendTime: {
            type: Date,
            required: true,
            default: new Date()
        },
        // 内容
        content: {
            type: String,
            required: true
        }
    },
    {
        // 返回一个虚拟的_id获取路径
        id: true,
        // __v字段
        versionKey: false
    }
)

module.exports = message
