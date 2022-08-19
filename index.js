"use strict"
require("dotenv").config({
    path: "./.env"
})

const path = require("path")
const express = require("express")
const cors = require("cors")
const { connect } = require("mongoose")
const apiRouter = require("./apiRouter.js")

const MONGOOSE_URL = process.env["MONGOOSE_URL"] || "mongodb://localhost:27017/chain_cs"
const PORT = process.env["PORT"] || 8080
const app = express()

// 连接(可以在连接前操作数据库，操作会被缓存)
connect(MONGOOSE_URL).then(() => {
    console.log("数据库连接成功")
    // require("./test")
})

app.use(express.json({ limit: "3mb" }))
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use("/api", apiRouter)
app.use("/resource", express.static("./resource"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/resource/page/index.html"))
})

app.listen(PORT, () => {
    console.log(`${process.env["RESOURCE_ORIGIN"]}:${PORT}`)
})
