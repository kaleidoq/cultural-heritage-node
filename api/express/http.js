const express = require('express')
const app = express()
require('express-async-errors');
// const domain = require('domain')
// var http = require('http');
// var io = require('socket.io');


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
    // // 捕获异常
    // var dom = domain.create();
    // domain.on('error', function (err) {
    //     // alternative: next(err)
    //     console.log(err.stack);
    //     res.statusCode = 500;
    //     res.end(err.message + '\n');
    //     domain.dispose();
    // });
    // domain.enter();
    // console.log(req.headers.origin, 'head')
    if (!whiteList.includes(req.url)) {
        verifyToken(req.headers.authorization).then(token => {
            console.log(token, 'token')
            req.body.userID = token.userID
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
const query = require('./backstage/queryList')
app.use('/backstage', query)
const report = require('./backstage/report')
app.use('/backstage', report)
const mock = require('./backstage/mock')
app.use('/backstage', mock)



//解析一遍post参数
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

//路由分发器
app.get('/', async (req, res) => {
    res.send('测试打通！没问题')
})

var server = app.listen(80, () => {
    console.log("打开服务器开始监听")
})


// 注册实时聊天socket
// var server = app.listen(8810)
var io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        // origin: 'http://localhost:8080',
        origin: ['http://localhost:8080', 'http://localhost:8081'],
        // async_mode: 'eventlet',
        // methods: ["GET", "POST"],
        credentials: true,
        allowEIO3: true
    }
});

// 监听客户端连接
io.on('connection', function (socket) {
    console.log('客户端连接')

    // 监听客户端断开
    socket.on('init', (data) => {
        console.log('前台连接', data)
    })

    // 监听客户端断开
    socket.on('disconnect', () => {
        console.log('客户端断开')
    })

    // 给客户端发送消息
    // socket.emit('welcome', '欢迎连接socket')
    socket.on('sendMessage', data => {
        console.log(`收到客户端的消息：${data}`)
        io.sockets.emit('broadcast_msg', data)
    })

    // 监听客户端消息
    socket.on('hello', data => {
        console.log('接收客户端发送数据', data)
    })

});