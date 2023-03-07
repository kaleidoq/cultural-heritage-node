const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')


const db = mysql.createPool(models.mysql)


// 获得消息的列表
router.get('/getChatList', (req, res) => {
    const user = req.body.userID
    const another = req.query.user_id
    // const user = 1
    // const another = 3
    let list_id = 0
    const chat = {}
    let sql = "select list_id from chat_main where user_id = ? and another_id = ?; select * from chat_main where user_id =? and another_id =?; "
    db.query(sql, [user, another, another, user], async (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes)
        mes.forEach(el => {
            if (el.length != 0) list_id = el[0].list_id
        });
        chat.list_id = list_id
        db.query("select * from chat_head_list where list_id=? order by send_time asc;", [list_id], async (err, mes) => {
            if (err) return console.log(err.message)
            console.log(mes, "chat")
            chat.list = mes
            new Result(chat, '消息数据获取成功').success(res)
        })
    })
})


// 提交聊天信息
router.post('/submitChat', async (req, res) => {
    const data = req.body
    console.log(data.list_id, data.userID, data.content, data.another_id)
    // console.log(data.list_id)
    // console.log(data.list_id == 0)

    if (data.list_id == 0) {
        const queryPromise = new Promise((res, rej) => {
            db.query("insert into chat_main (user_id, another_id) values (?,?); ", [data.userID, data.another_id], (err, mes) => {
                if (err) return console.log(err.message)
                // console.log(mes, 'list')
                res(mes)
            })
        })
        let listRes = await Promise.resolve(queryPromise)
        data.list_id = listRes.insertId
        console.log(data.list_id, 'listres')
    }
    let sql = "insert into chat_list (list_id, user_id, content) values (?,?,?);update chat_main set last_chat_id = last_insert_id() where list_id=?; "
    db.query(sql, [data.list_id, data.userID, data.content, data.list_id], (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, 'mes')
        new Result(data, '消息发送成功').success(res)
    })
})



// 搜索好友页面的所有聊天列表
router.get('/getPaperList', (req, res) => {
    const data = req.body
    // let sql = "select * from chat_main where user_id=? or another_id=?; "
    let sql = "select * from paper_list where user_id =? or another_id order by last_chat_time desc; "
    let promiseList = []
    const info = []
    const user = []
    db.query(sql, [data.userID, data.userID], async (err, mes) => {
        if (err) return console.log(err.message)
        mes.forEach((item, index) => {
            if (item.user_id == data.userID) user.push(item.another_id)
            else user.push(item.user_id)
        })
        mes.forEach((item, index) => {
            promiseList.push(new Promise((resolve, reject) => {
                db.query('select * from user_info where user_id=?;', [user[index]], (err, data) => {
                    if (err) return console.log(err.message)
                    console.log(mes[index], 'index', index)

                    console.log(data)
                    resolve(data[0])
                })
            }));
        });
        //放到循环外边  因为 rspList是一个数组
        // 再用Promise.all方法按顺序执行最后循环存入mes中
        Promise.all(promiseList).then((chil) => {
            chil.map((item, index) => {
                // mes[index].chilCount = item[0].count
                // info.push(item[0])
                // console.log(item, "item");
                mes[index].another_id = item.user_id
                mes[index].head = item.head
                mes[index].nickname = item.nickname
            });
            // console.log(mes, "mes");
            new Result(mes, "消息列表获取成功").success(res)
        });
    })
})

function getHeadChat(mes, callback) {

}

module.exports = router