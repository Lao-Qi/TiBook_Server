"use strict"
const { Server } = require("socket.io")
// const redis = require("redis")
const RSA_JWT = require("../lib/keys.js")
const io = new Server()
const port = parseInt(process.argv[2])
io.listen(port)

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
    VerifyToken(socket)
    // 订阅自己的房间
    const account = socket.data.account
    socket.join(account)
    // 用户当前所在的房间
    socket.data.room = account
    // 新增在线用户
    UserSet.add(account)
    console.log(`用户 ${socket.data.account} ${socket.data.name} 上线`)

    // 订阅自己的房间
    // subClient.subscribe(account, (msg) => {
    // 	io.to(account).emit("message", JSON.parse(msg));
    // }).then(() => {
    // 	socket.emit("connect msg", "服务器连接成功");
    // 	console.log(`用户 ${socket.data.account} ${socket.data.name} 上线`);
    // })

    // 客户端发布消息
    socket.on("send message", content => {
        // 消息信息
        const strMsg = {
            from: socket.data.account,
            to: socket.data.room,
            date: Date.now(),
            content,
        }

        socket.emit("message", strMsg)
        // 这条消息还需要发给其他房间
        if (socket.data.room !== socket.data.account) {
            io.to(socket.data.room).emit("message", strMsg)
        }
        console.log(`用户 ${socket.data.account} ${socket.data.name} 向 ${socket.data.room} 发布了消息: ${content}`)

        // // 发布到用户当前所在房间
        // pubClient.publish(socket.data.room, JSON.stringify(strMsg)).then(number => {
        // 	if(number === 1) {
        // 		console.log(`用户 ${socket.data.account} ${socket.data.name} 向 ${socket.data.room} 发布了消息: ${content}`);
        // 	}else {
        // 		socket.emit("connect msg", "用户不在线");
        // 	}
        // })
    })

    // 用户加入别人的房间(这里不需要socket.join加入别人的房间，而是修改用户当前的房间)
    // 如果用户加入了别人的房间，那么其他用户发给别人的房间的消息，这里的用户也就可以收到了(这是不可以的)
    socket.on("join room", account => {
        // 修改当前房间
        socket.data.room = account
        // 通知
        socket.emit("join room res", { code: 200, account })
        console.log(`用户 ${socket.data.account} ${socket.data.name} 加入了 ${account} 的房间`)
    })

    // 客户端退出
    socket.on("disconnecting", () => {
        // 在在线用户集合中删除用户
        console.log(`用户: ${socket.data.account} ${socket.data.name} 下线`)
        UserSet.delete(socket.data.account)

        // 取消订阅该用户房间
        // subClient.unsubscribe(UserAccount).then(() => {
        // 	console.log(`用户 ${UserAccount} ${socket.data.name} 下线`)
        // })
    })
})

// 用户的基础验证
function VerifyToken(socket) {
    const token = socket.handshake.auth.token
    // token没过期
    if (RSA_JWT.VerifyTimeIsOut(token)) {
        const UserInfo = RSA_JWT.DecryptJWT(token)
        // token解析正常
        if (UserInfo.account && UserInfo.name && UserInfo.id) {
            socket.data = UserInfo
        } else {
            socket.disconnect(true)
        }
    } else {
        socket.disconnect(true)
    }
}

console.log("Worker run in " + port)

// io.of("/pub").on("connection", (socket) => {
// 	VerifyToken(socket);
//
// 	socket.on("pub msg", (msg) => {
// 		const user = socket.data;
// 		// 发布到对应账号的房间
// 		pubClient.publish(msg.to, JSON.stringify({
// 			...user,
// 			text: msg.text
// 		})).then(() => {
// 			console.log(`@ ${user.account} ${user.name}发布了消息: ${msg.text}`);
// 		})
//
// 		// 也发布到自己的房间
// 		pubClient.publish(user.account, JSON.stringify({
// 			...user,
// 			text: msg.text
// 		}))
// 	})
//
// 	// const token = socket.handshake.auth.token;
// 	// // 验证Token
// 	// if(RSA_JWT.VerifyTimeIsOut(token)) {
// 	// 	const userInfo = RSA_JWT.DecryptJWT(token);
// 	// 	const account = userInfo.account;
// 	// 	// 把用户的基本信息绑定到用户的socket上
// 	// 	socket.data.name = userInfo.name;
// 	// 	socket.data.account = userInfo.account;
// 	//
// 	// 	// 用户创建房间, 把账号作为房间号
// 	// 	roomSet[account] = {};
// 	// 	socket.join(account);
// 	// 	console.log(socket.rooms);
// 	//
// 	// 	// 用户订阅自己的房间
// 	// 	roomSet[account][socket.id] = userInfo.name;
// 	// 	subClient.subscribe(account, (message) => {
// 	// 		message = JSON.parse(message);
// 	// 		io.to(account).emit("message", message);
// 	// 	}).then(() => {
// 	// 		console.log(`${port}进程: ${account} 用户创建了房间`);
// 	// 		socket.emit("connect-msg", "已订阅自己的房间");
// 	// 	});
// 	//
// 	//
// 	// 	socket.on("join", (data) => {
// 	// 		// 要联系的人的账号
// 	// 		const account = data.account;
// 	//
// 	// 		// 联系人在线且房间已创建
// 	// 		if(roomSet[account]) {
// 	// 			// 将用户添加到对应账号的房间中
// 	// 			socket.join(account);
// 	// 			socket.data.rooms.push(account);
// 	// 			roomSet[account][socket.id] = socket.data.name;
// 	//
// 	// 			io.to(account).emit("connect-msg", `${socket.data.name} 加入了 ${account}的房间`)
// 	// 			console.log(`${port}进程: ${socket.data.account} 加入了 ${account}的房间`);
// 	//
// 	// 		}else {
// 	// 			socket.emit("connect-msg", "用户不在线, 订阅失败");
// 	// 		}
// 	// 	})
// 	//
// 	//
// 	// 	// 用户发送消息
// 	// 	socket.on("say", (infoData) => {
// 	// 		// 向订阅该用户的房间发布消息
// 	// 		pubClient.publish(infoData.to, JSON.stringify({
// 	// 			event: "say",
// 	// 			data: {
// 	// 				name: socket.data.name,
// 	// 				from: infoData.from,
// 	// 				text: infoData.text
// 	// 			}
// 	// 		}))
// 	// 		console.log(`@ ${socket.data.account} ${socket.data.name}发送新消息: ${infoData.text}`);
// 	// 	})
// 	//
// 	//
// 	// 	// 用户断开连接
// 	// 	socket.on("disconnect", () => {
// 	// 		console.log(roomSet);
// 	// 		console.log(socket.data);
// 	// 		// 删除本地中该用户自身房间
// 	// 		delete roomSet[socket.data.account];
// 	// 		pubClient.publish(room, JSON.stringify({
// 	// 			event: "quit",
// 	// 			data: {
// 	// 				name: socket.data.name,
// 	// 				account: socket.data.account
// 	// 			}
// 	// 		})).then(() => {
// 	// 			console.log(`用户 ${roomSet[account][socket.id]} 断开连接, 当前还有聊天人数: ${num}`);
// 	// 		})
// 	// 		subClient.unsubscribe(socket.data.account);
// 	// 	})
// 	// }else {
// 	// 	socket.emit("connect", { code: 400, msg: "验证失败， Token过期"});
// 	// }
// })
