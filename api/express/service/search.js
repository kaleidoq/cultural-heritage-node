const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)

const util = require('util')
// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)

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


// 将搜索信息存入数据库
function insertSearch(data) {
    if (data.length != 0) return
    // console.log(data, 'insert')
    db.query(`select * from search_history where search_info='${data.info}'`, (err, mes) => {
        if (err) return console.log(err.message)
        if (mes.length === 0) {
            let sql = `insert into search_history (search_info,user_id) values ("${data.info}",${data.userID});`
            db.query(sql, (err, mes) => {
                if (err) return console.log(err.message)
                console.log("没有重复搜索，信息添加成功")
                // new Result(mes, '搜索信息添加成功').success(res)
            })
        } else {
            let sql = `update search_history set search_time=now() where search_info=? and user_id =?;`
            db.query(sql, [data.info, data.userID], (err, mes) => {
                if (err) return console.log(err.message)
                console.log("重复搜索，时间修改成功")
            })
        }
    })

}


// 搜索文章信息
router.post('/searchArticle', (req, res) => {
    const body = req.body
    console.log(body)
    insertSearch(body)
    let sql = `select *
        from cover_content as cn
        where
                cn.title like '%${body.info}%'or cn.content like '%${body.info}%'
        order by
            case
                when cn.title like '%${body.info}%' then length(REPLACE(cn.title,'${body.info}',''))/length(cn.title)
                when cn.content like '%${body.info}%' then length(REPLACE(cn.content,'${body.info}',''))/length(cn.content)
                end
        limit ${body.length},10`
    // db.query(`select * from cover_content where title like '%${body.info}%' limit ${body.length},10;`, [body.parent, body.article, body.content, body.userID], (err, mes) => {
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes")
        new Result(mes, '搜索文章成功').success(res)
    })
})




// 查询用户
router.post('/searchUser', (req, res) => {
    const query = req.query
    const data = req.body
    insertSearch(data)
    sql = `select user_id,head,introduce,nickname from user_info as cn
        where cn.introduce like '%${data.info}%'or cn.nickname like '%${data.info}%'
            order by
                case
                    when cn.introduce like '%${data.info}%' then length(REPLACE(cn.introduce,'${data.info}',''))/length(cn.introduce)
                    when cn.nickname like '%${data.info}%' then length(REPLACE(cn.nickname,'${data.info}',''))/length(cn.nickname)
                    end
        limit ${data.length},10`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, 'searchUser');
        new Result(mes, '用户列表查询成功').success(res)
    })
})

// 查询标签
router.post('/searchTags', (req, res) => {
    const query = req.query
    const body = req.body
    insertSearch(body)
    sql = `select *
        from cover_content as cn
        where cn.tags like '%${body.info}%'
        order by
            case when cn.tags like '%${body.info}%' then length(REPLACE(cn.tags,'${body.info}',''))/length(cn.tags)
            end
        limit ${body.length},10`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes, 'searchtag');
        new Result(mes, '用户标签查询成功').success(res)
    })
})


/**
 * 搜索商品内容
 * @param {info,length}
 */
router.post('/searchGoods', async (req, res) => {
    // const query = req.query
    const body = req.body
    insertSearch(body)
    sql = `select *
        from cover_content as g
        where
                g.title like '%${body.info}%'or g.content like '%${body.info}%'
        order by
            case
                when g.title like '%${body.info}%' then length(REPLACE(g.title,'${body.info}',''))/length(g.title)
                when g.content like '%${body.info}%' then length(REPLACE(g.content,'${body.info}',''))/length(g.content)
                end
        limit ${body.length},10`
    const mes = await db.queryAsync(sql)
    new Result(mes, '商品查询成功').success(res)
})



module.exports = router