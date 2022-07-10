"use strict"
const cpuNum = require("os").cpus().length
const child_process = require("child_process")
const path = require("path")
// 加载本地环境变量
require("dotenv").config({
    path: path.join(__dirname, "../.env"),
})
const workArr = [] // 存储线程集群
let port = parseInt(process.env.WEBSOCKET_POST) ?? 6001

for (let i = 0; i < cpuNum; i++) {
    workArr.push(fork("./fork_server.js", [port + i]))
}

function fork(filePath, args) {
    return child_process.fork(path.join(__dirname, filePath), args)
}
