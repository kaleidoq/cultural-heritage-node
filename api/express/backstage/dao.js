const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const { createToken } = require('../token.js')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)


router.post('/login', (req, res) => {
    const data = req.body
    // console.log(data)
    db.query('select * from user_login where username = ?', [data.username], (err, mes) => {
        if (err) return console.log(err)
        let results = JSON.stringify(mes);
        //把results对象转为字符串，去掉 RowDataPacket
        let obj = JSON.parse(results)[0];
        //把results对象转为字符串，去掉 RowDataPacket
        console.log(obj)
        if (!obj) {
            console.log('没有账号！！！')
            new Result('没有该账号').fail(404, res)
            // res.status(404).send('没有账号！！！')
            // res.status(404).json('没有任何内容');
        } else if (data.password != obj.password) {
            console.log('密码错误！！！')
            // mes.message = "密码错误！！！"
            // res.status(403)
            // res.send({ message: '密码错误！！！' })
            new Result('密码错误').fail(404, res)
        } else {
            console.log(obj)
            // tokenjs.createToken(mes.user_id)
            const user = { userID: obj.user_id }
            console.log(user)
            let token = createToken(user)
            console.log(token)
            db.query('select head from user_info where user_id=?', [obj.user_id], (err, mes) => {
                if (err) return console.log(err.message)
                let head = mes[0].head
                new Result({ token, head }, '登录成功').success(res)
            })
        }
    })
})

module.exports = router