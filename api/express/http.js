const express = require('express')
const app = express()

// 配置解析 数据格式为表单数据的请求体 的中间件
// app.use(express.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ extended: true, limit: "10mb" }));
app.use(express.json());

const cors = require('cors')
app.use(cors())


const { verifyToken } = require('./token')
//全局中间件，进行token的验证
//白名单
const Result = require('./util/Result')
const whiteList = ['/api/user/login', '/backstage/login']
app.use((req, res, next) => {
    // console.log(req)
    if (!whiteList.includes(req.url)) {
        verifyToken(req.headers.authorization).then(token => {
            console.log(token, 'token')
            req.body.userID = token.userID
            // console.log(req.body)
            next()
        }).catch(err => {
            res.status(401)
            new Result('错误', '登录信息失效').fail(401, res)
        })
    } else {
        next()
    }
})


// 注册路由组件
const user = require('./service/user')
app.use('/api/user', user)
const picture = require('./service/picture')
app.use('/api/picture', picture)
const article = require('./service/article')
app.use('/api/article', article)
const paper = require('./service/paper')
app.use('/api/paper', paper)
const dynamic = require('./service/dynamic')
app.use('/api/dynamic', dynamic)
const news = require('./service/news')
app.use('/api/news', news)
const search = require('./service/search')
app.use('/api/search', search)
const goods = require('./service/goods')
app.use('/api/goods', goods)
const order = require('./service/order')
app.use('/api/order', order)

// 后台管理
const dao = require('./backstage/dao')
app.use('/backstage', dao)
const handle = require('./backstage/handle')
app.use('/backstage', handle)


// 验证token
// const tokenjs = require('./token')
// app.use(tokenjs.verifyToken('aa'))
// indexApi.get('/profile', auth.auth, async (req, res) => {
//     res.send(req.user)
// })


//解析一遍post参数
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

//路由分发器
app.get('/test', async (req, res) => {
    res.send('测试打通！没问题')
})


app.listen(80, () => {
    console.log("打开服务器开始监听")
})