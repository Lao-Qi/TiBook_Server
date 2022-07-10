"use strict"

const { model } = require("mongoose")

// 文档
const user = require("./user-schema")
const message = require("./message-schema")
const Users = model("users", user)
const Message = model("message", message)

module.exports = {
    Users,
    Message,
}
