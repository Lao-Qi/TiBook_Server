"use strict"
// const cpuNum = require("os").cpus().length
const child_process = require("child_process")
const path = require("path")
// 加载本地环境变量
require("dotenv").config({
    path: path.join(__dirname, "../.env")
})

let port = parseInt(process.env.WEBSOCKET_POST) ?? 6001
child_process.fork(path.join(__dirname, "./server.js"), [port])

// const workArr = [] // 存储线程集群

// // 开启多个线程
// for (let i = 0; i < cpuNum; i++) {
//     workArr.push(fork("./fork_server.js", [port + i]))
// }

// function fork(filePath, args) {
//     return child_process.fork(path.join(__dirname, filePath), args)
// }
