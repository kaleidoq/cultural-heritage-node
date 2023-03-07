const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)

// 热门搜索信息获得
router.get('/getHotSearch', (req, res) => {
    // let sql = `select count(s.search_info) as search_count, s.search_info
    //             from search_history s group by s.search_info order by search_count desc limit 10;`
    let sql = `select s.search_info
                from search_history s group by s.search_info order by count(s.search_info) desc limit 10;`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, "mes")
        let hot = []
        mes.map(item => {
            hot.push(item.search_info)
        })
        new Result(hot, '文章热门信息获取成功').success(res)
    })
})

// 将搜索信息存入数据库
function insertSearch(data) {
    if (data.length != 0) return
    console.log(data, 'insert')
    let sql = `insert into search_history (search_info) values ("${data.info}");`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, "搜索信息添加成功")
        // new Result(mes, '搜索信息添加成功').success(res)
    })
}



// 查找用户搜索历史
router.get('/getSearchHistory', (req, res) => {
    const body = req.body
    // let sql = `select count(s.search_info) as search_count, s.search_info
    //             from search_history s group by s.search_info order by search_count desc limit 10;`
    let sql = `select search_info from search_history where user_id=? and is_del='false'
     order by search_time desc limit 10;`
    db.query(sql, [body.userID], (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, "mes")
        let history = []
        mes.map(item => {
            history.push(item.search_info)
        })
        new Result(history, '搜索记录获取成功').success(res)
    })
})



// 搜索文章信息
router.post('/searchArticle', (req, res) => {
    const body = req.body
    console.log(body)
    insertSearch(body)
    // let sql = `insert into article_comment(parent_comment_id, article_id, comment_content,user_id) values(${body.parent},${body.article},${body.content},${body.userID}); `
    db.query(`select * from cover_content where title like '%${body.info}%' limit ${body.length},10;`, [body.parent, body.article, body.content, body.userID], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes")
        new Result(mes, '搜索文章成功').success(res)
    })
})




module.exports = router