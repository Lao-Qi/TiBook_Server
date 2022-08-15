"use strict"
/**
 * 和客户端建立socket连接实现消息发送和接收的服务
 *
 * 流程: 获取token并绑定到自身套接字 -> 套接字加入自己的房间(用于接收发送给自己的消息) -> 绑定服务功能的事件
 */
const { Server } = require("socket.io")
// const redis = require("redis")
const RSA_JWT = require("../lib/keys.js")
const { Users } = require("../model/model")

const io = new Server()
const port = parseInt(process.argv[2])

// redis的消息订阅与发布，一个用来订阅，一个用来发布
// const pubClient = redis.createClient({ url: process.env.REDIS_URL });
// const subClient = redis.createClient({ url: process.env.REDIS_URL });
// // v4版本的node-redis需要手动调用.connect()方法来连接
// Promise.all([
// 	pubClient.connect(),
// 	subClient.connect()
// ]).then(() => {
// 	io.listen(port);
// })

// 在线用户集合
const UserSet = new Set()

io.on("connection", socket => {
    /**
     * data 存储该socket的用户信息
     * socket.data = {
     *     account,
     *     name,
     *     avatar,
     *     id, // login接口返回的token中携带的数据库中的id
     *     recipient // 发送信息的接收者
     * }
     */
    VerifyToken(socket)

    // 订阅自己的房间
    socket.join(socket.data.account)
    // 接收者设置为自己
    socket.data.recipient = socket.data.account

    // 新增在线用户
    UserSet.add(socket.data.account)
    console.log(`用户 ${socket.data.account} ${socket.data.name} 上线`)

    // 客户端发送文本消息
    socket.on("client-send-message", msg => {
        // 确定消息的信息
        const messagrInfo = {
            from: socket.data.account,
            to: socket.data.recipient,
            ...msg
        }

        // 返回本次发送的状态
        socket.emit(`client-send-message-return-${msg.uid}`, { code: 200, msg: "发送成功" })
        // 向自己发送消息
        socket.emit("receive-message", messagrInfo)
        // 向接收者发送消息
        io.to(socket.data.recipient).emit("receive-message", messagrInfo)
        // if (UserSet.has(socket.data.recipient)) {
        //     io.to(socket.data.recipient).emit("receive-message", messagrInfo)
        // }

        console.log(
            `用户 ${socket.data.account} ${socket.data.name} 向 ${socket.data.recipient} 发布了消息: ${msg.content}`
        )
    })

    // 切换用户的消息接收者
    socket.on("client-toggle-recipient", recipient => {
        // 修改当前房间
        socket.data.recipient = recipient
        // 通知
        socket.emit("client-toggle-recipient-return", recipient)
        console.log(`用户 ${socket.data.account} ${socket.data.name} 加入了 ${recipient} 的房间`)
    })

    /**
     * 用户添加好友
     *
     * 流程: 发送一条添加好友的消息到要添加的好友，要添加的好友允许好友添加的时候就发送添加好友的api
     */
    socket.on("clinet-add-friend", async ({ account: faccount }) => {
        io.to(faccount).emit("add-friend-message", {
            id: socket.data.id,
            account: socket.data.account,
            name: socket.data.name,
            avatar: socket.data.avatar
        })

        socket.emit("client-add-friend-return", { code: 200 })
        console.log(`${socket.data.account} ${socket.data.name} 向 ${faccount}发送添加好友的申请`)
    })

    // 客户端退出
    socket.on("disconnecting", () => {
        // 在在线用户集合中删除用户
        console.log(`用户: ${socket.data.account} ${socket.data.name} 下线`)
        UserSet.delete(socket.data.account)
    })
})

/**
 * 验证token并获取信息绑定到套接字身上
 * @param {any} socket
 */
function VerifyToken(socket) {
    const token = socket.handshake.auth.token
    if (RSA_JWT.VerifyTimeIsOut(token)) {
        const UserInfo = RSA_JWT.DecryptJWT(token)
        if (UserInfo.account && UserInfo.name && UserInfo.id) {
            socket.data = UserInfo
        } else {
            socket.disconnect(true)
            return
        }
    } else {
        socket.disconnect(true)
        return
    }
}

console.log("Worker run in " + port)
io.listen(port)
