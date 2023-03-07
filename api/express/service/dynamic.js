const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const { createToken } = require('../token.js')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)

// 获得关注人的动态信息
router.get('/getFollowDynamic', (req, res) => {
    const data = req.body
    const query = req.query
    sql = `select * from cover_content where user_id in
                                  (select followed_user_id from followee_user
                                  where user_id = ${data.userID}) order by create_time desc limit ${query.length},7;`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, 'searchUser');
        new Result(mes, '关注动态查询成功').success(res)
    })
})



module.exports = router