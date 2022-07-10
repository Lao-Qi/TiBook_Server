const { Users } = require("../../model/model")
const router = require("express").Router()

/** 搜索全部匹配的用户和群 */
router.get("/SearchUsers", async (req, res) => {
    const keyWorld = req.query.key
    const matchResultList = []
    if (keyWorld) {
        // 关键词匹配的用户
        const matchUserList = await FindRegexNameUsers(keyWorld)
        matchUserList && matchResultList.push(...matchUserList)
        // 账号匹配的用户
        if (keyWorld.length >= 6 && keyWorld.length <= 24) {
            const accountMatchUser = await FindRegexAccountUsers(keyWorld)
            accountMatchUser && matchResultList.push(accountMatchUser)
        }
        // 长度为24的关键词可以转换为ID进行ID查找
        if (keyWorld.length >= 24) {
            const idMatchUser = await FindOneRegexIDUser(keyWorld)
            idMatchUser && matchResultList.push(idMatchUser)
        }

        res.send({
            code: 200,
            search: true,
            key: keyWorld,
            List: matchResultList,
        })
    } else {
        res.send({
            code: 404,
            search: false,
            key: keyWorld,
            msg: "缺失关键词",
        })
    }
})

// 查找名称匹配的用户
async function FindRegexNameUsers(keyWorld) {
    return new Promise((res) => {
        Users.find(
            {
                name: {
                    $regex: keyWorld,
                },
            },
            {
                _id: 1,
                name: 1,
                account: 1,
                avatar: 1,
            },
            (err, docs) => {
                res(docs)
            }
        )
    })
}

// 查询账号匹配的用户
async function FindRegexAccountUsers(account) {
    return new Promise((res) => {
        Users.findOne(
            {
                account,
            },
            {
                name: 1,
                account: 1,
                avatar: 1,
            },
            null,
            (err, doc) => {
                res(doc)
            }
        )
    })
}

// 查询ID匹配的用户
async function FindOneRegexIDUser(id) {
    return new Promise((res) => {
        Users.findOne(
            {
                _id: id,
            },
            {
                _id: 1,
                name: 1,
                account: 1,
                avatar: 1,
            },
            null,
            (err, doc) => {
                res(doc)
            }
        )
    })
}

module.exports = router
