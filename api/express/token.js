const jwt = require("jsonwebtoken")
    //撒盐，加密时候混淆
const secret = '123bingjspoiuytrewqlkjhgfdsa'


const Result = require('./util/Result')


//生成token
//info也就是payload是需要存入token的信息
// export function createToken(info) {


// module.exports.createToken = function createToken(info) {
createToken = function(info) {
        let token = jwt.sign(info, secret, {
            //Token有效时间 单位s
            // expiresIn: 60 * 60 * 10 //十个小时
        })
        return token
    }
    // exports.createToken = createToken

//验证Token
// module.exports = function verifyToken(token) {
// verifyToken = function(token) {
//         return new Promise((resolve, reject) => {
//             jwt.verify(token, secret, (error, result) => {
//                 if (error) {
//                     reject(error)
//                 } else {
//                     resolve(result)
//                 }
//             })
//         })
// }

//验证token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                // resolve(data)
                new Result('登录信息失效').fail(401, res)
                return err
                reject(err)
                    // res.status(401)
            } else {
                resolve(data)
            }
        })
    })
}


// exports.verifyToken = verifyToken
module.exports = {
    createToken,
    verifyToken
}


// exports = {
//     auth: async(req, res, next) => {
//         //注意啊这个字段是我们前端需要实现的，因为这是后台要求的
//         let raw = String(req.headers.authorization).split(' ').pop() //我为啥要用空格分隔，因为我发起请求的时候多加了一个字段，
//         const tokenData = jwt.verify(raw, 'asdasdasdasdasdasdasdasdasdasdasd')
//         let { id } = tokenData
//         //加到req上以便以给下一个中间件使用
//         req.user = await User.findById(id)
//         next()
//     }
// }



//设置允许跨域
// app.use(function (req, res, next) {
//     //指定允许其他域名访问 *所有
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     //允许客户端请求头中带有的
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     //允许请求的类型
//     res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.setHeader("X-Powered-By", ' 3.2.1')
//     //让options请求快速返回
//     if (req.method == "OPTIONS") res.send(200);
//     else next();
// });

//白名单
const whiteList = ['/login']

// app.use((req, res, next) => {
//     if (!whiteList.includes(req.url)) {
//         verifyToken(req.headers.authorization).then(res => {
//             next()
//         }).catch(e => {
//             res.status(401).send('invalid token')
//         })
//     } else {
//         next()
//     }
// })

// app.post('/login', (req, res) => {
//     let token = createToken(user)
//     res.json({ token })
// })

// app.get("/api/info", (req, res) => {
//     res.send({
//         result: 1,
//         data: { "name": "Bmongo", "id": 1 }
//     })
// })








//先引入 jsonwebtoken
// var jsonWebToken = require('jsonwebtoken');

// //密钥，当然实际的项目中密钥应该变态一些
// const SECRET_KEY = 'kite1874'

// const token = jsonWebToken.sign({
//     // Payload 部分，官方提供七个字段这边省略，可以携带一些可以识别用户的信息。例如 userId。
//     // 千万不要是用敏感信息，例如密码，Payload 是可以解析出来的。
//     userId: user.userId,
//     role: user.role
// }, SECRET_KEY, {
//     expiresIn: "24h", //token有效期
//     // expiresIn: 60 * 60 * 24 * 7,  两种写法
//     // algorithm:"HS256"  默认使用 "HS256" 算法
// })

// console.log(token)

// module.exports = router;