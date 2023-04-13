const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const { createToken } = require('../token.js')
const Result = require('../util/Result')
const util = require('util')


const db = mysql.createPool(models.mysql)

db.queryAsync = util.promisify(db.query)


const data = require('./data')



/**
 * 删除分类名称
 * @return {class_id}
 */
router.post('/setTime', async (req, res) => {
    // const data = req.body
    let time = data.time
    console.log(data.time[0])
    for (let index = 1; index < time.length; index++) {
        const item = time[index];
        console.log(index)
        // console.log(item)
        let sql = `update goods_info
            set create_time = '${item.create_time}'
            where goods_id=${index};`
        const result = await db.queryAsync(sql)
    }
})


/**
 * 删除分类名称
 * @return {class_id}
 */
router.post('/setAge', async (req, res) => {
    // const data = req.body
    let time = data.age
    console.log(data.age[0])
    for (let index = 1; index < time.length; index++) {
        const item = time[index];
        console.log(index)
        // console.log(item)
        // let sql = `update user_info
        //     set age = '${item.age}'
        //     where user_id=${index};`
        const result = await db.queryAsync(sql)
    }
})


/**
 * 删除分类名称
 * @return {class_id}
 */
router.post('/setAddress', async (req, res) => {
    // const data = req.body
    // let time = data.time
    // console.log(data.time[0])
    let sql = `select index1 , substring_index(sql1.s1, ' ',1) as index2 ,substring_index(sql1.s1, ' ',-1) as index3,goods_id as id from
(select substring_index(u.address, ' ',1) as index1, substring_index(u.address, ' ',-2) as s1, goods_id from goods_info u) sql1
`
    // const result = await db.queryAsync(sql)

    for (let index = 101; index < result.length; index++) {
        // for (let index = 0; index < 2; index++) {
        const item = result[index];
        console.log(index)
        // console.log(item)
        sql = `update goods_info set address ='${item.index1 + '-' + item.index2 + '-' + item.index3}' where goods_id=${item.id}`
        // const mes = await db.queryAsync(sql)
    }
})


/**
 * 删除分类名称
 */
router.post('/setCollect', async (req, res) => {
    // const data = req.body
    // let time = data.collect
    console.log(data.collect[0])
    for (let index = 1; index < time.length; index++) {
        const item = time[index];
        console.log(index)
        // console.log(item)
        // let sql = `insert into collection_goods_user (user_id, goods_id, collect_time)
        // values (${item.user_id},${item.id},'${item.collect_time}');`
        // let sql = `insert into collection_article_user (user_id, article_id, collect_time)
        // values (${item.user_id},${item.id},'${item.collect_time}');`
        // let sql = `insert into like_list (user_id, article_id, create_time)
        // values (${item.id},${item.user_id},'${item.collect_time}');`
        const result = await db.queryAsync(sql)
    }
})


/**
 * 删除分类名称
 */
router.post('/addOrder', async (req, res) => {
    // const data = req.body
    // let time = data.order
    console.log(data.order[0])
    for (let index = 1; index < time.length; index++) {
        const item = time[index];
        console.log(index)
        // console.log(item)
        let sql = `insert into order_list (goods_id, seller_user_id, buyer_user_id, price,
                        status, create_time)
values (${item.id},${item.seller},${item.buyer},${item.price},${item.status},'${item.create_time}');`
        // let sql = `insert into collection_article_user (user_id, article_id, collect_time)
        // values (${item.user_id},${item.id},'${item.collect_time}');`
        // let sql = `insert into like_list (user_id, article_id, create_time)
        // values (${item.id},${item.user_id},'${item.collect_time}');`
        // const result = await db.queryAsync(sql)
    }
})

module.exports = router