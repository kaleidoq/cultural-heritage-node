const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)
// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)


/**
 *  获得用户的相关数据
 *  @param()
 */
router.get('/reportOrderPrice', async (req, res) => {
    let sql = `SELECT name, count(*) AS value
        FROM
    (select case
                when price >= 0 and price <= 9.99 then '0-10'
                when price >= 10 and price <= 19.99 then '10-20'
                when price >= 20 and price <= 49.99 then '20-50'
                 when price >= 50 and price <= 99.99 then '50-100'
                 when price >= 100 and price <= 199.99 then '100-200'
                 when price >= 200 and price <= 249.99 then '200-250'
                 else '250+'
                end as name
     FROM order_list
     WHERE 1
    ) AS  price_summaries
        GROUP BY name
        ORDER BY name;`
    const mes = await db.queryAsync(sql)
    // console.log(mes)
    new Result(mes, '价格区间可视化数据获取成功').success(res)
})


/**
 *  文章的按日期时间分类小时
 *  @param(date)
 */
router.get('/reportArticleDate', async (req, res) => {
    const data = req.query
    console.log(data.date, 'date')
    let sql = `select COUNT(1) as count, DATE_FORMAT(create_time,'%H') as hours
        from article group by DATE_FORMAT(create_time ,'%H')`
    if (data.date != undefined && data.date != '') {
        sql = `select COUNT(1) as count, DATE_FORMAT(create_time,'%H') as hours from article
        where DATE_FORMAT(create_time,'%Y-%m-%d') = DATE_FORMAT('${data.date}','%Y-%m-%d')
        group by DATE_FORMAT(create_time ,'%H')`
    }
    const mes = await db.queryAsync(sql)
    const list = []
    mes.map(item => {
        let el = {
            name: parseInt(item.hours) + ':00-' + (parseInt(item.hours) + 1) + ':00',
            value: item.count
        }
        list.push(el)
    })
    // console.log(list)
    new Result(list, '文章每天时间曲线数据获取成功').success(res)
})


/**
 *  查找文章前十个最多作品的分类的数量
 *  @param()
 */
router.get('/reportClassArtDate', async (req, res) => {
    const data = req.query
    console.log(data.date, 'date')
    let sql = `select ifnull(art,0) as art_count,ifnull(good,0) as good_count,c.class_id,c.class_name,
                    ifnull(art,0)+ifnull(good,0) as total
                from (classify c left join
                    (select COUNT(*) as art,a.class_id
                     from article a group by a.class_id) a on c.class_id=a.class_id ) left join
                    (select COUNT(*) as good,class_id
                     from goods_info g group by class_id) g
                on c.class_id=g.class_id order by total desc`
    // if (data.date != undefined && data.date != '') {
    //     sql = `select COUNT(1) as count, DATE_FORMAT(create_time,'%H') as hours from article
    //     where DATE_FORMAT(create_time,'%Y-%m-%d') = DATE_FORMAT('${data.date}','%Y-%m-%d')
    //     group by DATE_FORMAT(create_time ,'%H')`
    // }
    const mes = await db.queryAsync(sql)
    const art = []
    const good = []
    const name = []
    mes.map(item => {
        art.push(item.art_count)
        good.push(item.good_count)
        name.push(item.class_name)
    })
    let list = { art: art, good: good, name: name }
    // mes.map(item => {
    //     let el = {
    //         name: parseInt(item.hours) + ':00-' + (parseInt(item.hours) + 1) + ':00',
    //         value: item.count
    //     }
    //     list.push(el)
    // })
    console.log(list)
    new Result(list, '每个分类的文章总数和商品总数获取成功').success(res)
})


/**
 *  获得用户性别数据
 *  @param()
 */
router.get('/reportUserSex', async (req, res) => {
    const data = req.query
    console.log(data.date, 'date')
    let sql = `select s.sex,count(*) as value from user_info s GROUP BY sex;`
    const mes = await db.queryAsync(sql)
    // mes.map(item => { })
    // let list = { art: art, good: good, name: name }
    // mes.map(item => {
    //     let el = {
    //         name: parseInt(item.hours) + ':00-' + (parseInt(item.hours) + 1) + ':00',
    //         value: item.count
    //     }
    //     list.push(el)
    // })
    // console.log(list)
    new Result(mes, '获得用户性别数据成功').success(res)
})


/**
 *  获得用户地址省份总和数据
 *  @param()
 */
router.get('/reportUserAddress', async (req, res) => {
    let sql = `select count(province) as count,province from (select substring_index(u.address, '-', 1)
    as province from user_info u) ad where province!='null' group by province order by count desc`
    const mes = await db.queryAsync(sql)
    new Result(mes, '获得用户地址省份总和数据成功').success(res)
})


module.exports = router