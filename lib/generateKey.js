"use strict"
const fs = require("fs")
const path = require("path")
const { randomBytes, generateKeyPairSync } = require("crypto")

const passphrase = process.env.passphrase || randomBytes(10).toString("hex")
// 生成RSA加密密钥
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "spki",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: passphrase,
    },
})

fs.writeFileSync(
    path.join(__dirname, "../keys/passphrase.txt"),
    passphrase,
    "utf8"
)
fs.writeFileSync(
    path.join(__dirname, "../keys/publicKey.key"),
    publicKey,
    "utf8"
)
fs.writeFileSync(
    path.join(__dirname, "../keys/privateKey.key"),
    privateKey,
    "utf8"
)
