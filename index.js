"use strict"
require("dotenv").config({
    path: "./.env",
})
const path = require("path")
const { createServer } = require("http")
const express = require("express")
const cors = require("cors")
const { connect } = require("mongoose")
const apiRouter = require("./apiRouter.js")

const MONGOOSE_URL =
    process.env["MONGOOSE_URL"] || "mongodb://localhost:27017/chain_cs"
const PORT = process.env["PORT"] || 8080
const app = express()

// 连接(可以在连接前操作数据库，操作会被缓存)
connect(MONGOOSE_URL).then(() => {
    console.log("数据库连接成功")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use("/user", express.static("./user"))
app.use("/api", apiRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../demo/index.html"))
})

const server = createServer(app)

server.listen(PORT, () => {
    console.log("http://127.0.0.1:8080")
})
