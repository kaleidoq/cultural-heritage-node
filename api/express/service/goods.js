const router = require('express').Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)

// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)


/**
 * 获得全部商品列表信息
 * @param (length, status)
 */
router.get('/getGoodsList', async (req, res) => {
    const user = req.body.userID
    const query = req.query
    console.log(query.length, 'length');
    let sql = `select * from goods_info where is_del=0 and is_promote=0 order by create_time desc limit ?,10;`
    const mes = await db.queryAsync(sql, [parseInt(query.length)])
    // const list = []
    // for (let index = 0; index < mes.length; index++) {
    //     const item = mes[index];
    //     if (item.is_promote) {
    //         const order = await db.queryAsync(`select order_id,status,buyer_user_id from order_list where goods_id=?;`, [item.goods_id])
    //         list.push({ ...item, ...order[0] })
    //     } else list.push(item)
    // }
    // console.log(list, 'goods')
    // if (mes.affectedRows = 1) {
    new Result(mes, '商品列表获取成功').success(res)
})


/**
 * 获得用户自己商品列表信息
 * @param (userID)
 */
router.get('/getUserGoodsList', async (req, res) => {
    const user = req.body.userID
    let sql = `select * from goods_info where user_id=? and is_del=0 order by create_time desc;`
    const mes = await db.queryAsync(sql, [user])
    const list = []
    for (let index = 0; index < mes.length; index++) {
        const item = mes[index];
        if (item.is_promote) {
            const order = await db.queryAsync(`select order_id,status,buyer_user_id from order_list where goods_id=?;`, [item.goods_id])
            list.push({ ...item, ...order[0] })
        } else list.push(item)
    }
    // console.log(list, 'goods')
    // if (mes.affectedRows = 1) {
    new Result(list, '商品列表获取成功').success(res)
})


/**
 * 获得商品详情信息
 */
router.get('/getGoods', async (req, res) => {
    const data = req.query
    let sql = `select * from goods_info where goods_id=?;`
    const mes = await db.queryAsync(sql, [data.goods_id])
    // console.log(mes, 'goods')
    // if (mes.affectedRows = 1) {
    new Result(mes[0], '商品获取成功').success(res)
})


// 设置查看次数+1
router.put('/putGoodLook', async (req, res) => {
    const data = req.body
    let sql = `update goods_info set look = look + 1 where goods_id = ?;`
    const mes = await db.queryAsync(sql, [data.goods_id])
    new Result(mes, '商品查看次数增加成功').success(res)
})


// 获得用户的信息
router.get('/getGoodsDesc', async (req, res) => {
    const data = req.query
    let sql = `select * from collection_goods_user where user_id =${data.userID} and goods_id =${data.goods_id};`
    const mes = await db.queryAsync(sql, [data.goods_id])
    new Result(mes[0], '商品获取成功').success(res)
})


/**
 * 用户和这个商品以及商家的关系
 * @param(user_id,goods_id,followed_user_id)
 *@returns(is_follow,is_collect)
 */
router.get('/getGoodsUser', async (req, res) => {
    const data = req.query
    let sql = `select * from collection_goods_user where user_id =${data.userID} and goods_id =${data.goods_id};`
    const mes = await db.queryAsync(sql)
    new Result(mes[0], '商品获取成功').success(res)
})


/**
 * 添加商品
 * @param(form)
 *@returns(mes)
 */
router.post('/addGoods', async (req, res) => {
    const user = req.body.userID
    const data = req.body
    let sql = `insert into goods_info
    (user_id, content, title, price, images,  address, class_id, tags)
        values(${user},'${data.content}','${data.title}','${data.price}',
        '${data.images}','${data.address}',${parseInt(data.class_id)},'${data.tags}');`
    const mes = await db.queryAsync(sql)
    new Result(mes, '商品添加成功').success(res)
})


/**
 * 删除帖子（实际不删除，设置idDel=1
 * @param(article_id)
 */
router.delete('/deleteGoods', async (req, res) => {
    const data = req.body //获得传递过来的数据
    let sql = `update goods_info set is_del=1, del_time=now() where goods_id=?;`
    const mes = await db.queryAsync(sql, [data.goods_id])
    if (mes.affectedRows = 1) {
        new Result('商品删除成功').message(res)
    } else {
        new Result('商品删除失败').fail(404, res)
    }
})


/**
 * 修改商品
 * @param(form)
 *@returns(mes)
 */
router.post('/updateGoods', async (req, res) => {
    const user = req.body.userID
    const data = req.body
    let sql = `UPDATE craft.goods_info t
SET t.content  = '${data.content}',
    t.title    = '${data.title}',
    t.price    = ${parseFloat(data.price)},
    t.images   = '${data.images}',
    t.address  = '${data.address}',
    t.class_id = ${parseInt(data.class_id)},
    t.tags     = '${data.tags}'
WHERE t.goods_id = ${data.goods_id};`
    // let sql = `insert into goods_info
    // (user_id, content, title, price, images,  address, class_id, tags)
    //     values(${user},'${data.content}','${data.title}','${data.price}',
    //     '${data.images}','${data.address}',${parseInt(data.class_id)},'${data.tags}');`
    const mes = await db.queryAsync(sql)
    new Result(mes, '商品修改成功').success(res)
})


/**
 * 获得商品的收藏数量
 * @param(goods_id)
 * @returns(collect_count)
 */
router.get('/getGoodCollectCount', async (req, res) => {
    const query = req.query
    const user = req.body.userID //获得传递过来的数据
    let sql = `select count(*) as collect_count
from collection_goods_user where goods_id=${query.goods_id} group by goods_id;
select * from collection_goods_user where goods_id=${query.goods_id} and user_id=${user};`
    const mes = await db.queryAsync(sql)
    let result = {}
    if (mes[0].length) {
        result = mes[0][0]
        console.log(mes, 'result')
        if (mes[1].length != 0) {
            result.is_collect = true
        } else {
            result.is_collect = false
        }
    } else {
        result.collect_count = 0
        result.is_collect = false
    }
    new Result(result, '商品收藏获取成功').success(res)
})


/**
 * 修改收藏商品的
 * @param(goods_id，flag)
 * @returns(mes)
 */
router.put('/putCollect', (req, res) => {
    const user = req.body.userID
    const body = req.body
    let sql = ''
    if (!body.flag) {
        sql = 'insert into collection_goods_user (user_id, goods_id) values (?,?)'
    } else {
        sql = 'delete from collection_goods_user where user_id =? and goods_id =?;'
    }
    db.query(sql, [user, body.goods_id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes");
        if (mes.affectedRows == 0)
            new Result(mes, "收藏信息修改失败").fail(-1, res)
        else
            new Result(mes, "收藏信息修改成功").success(res)

    })
})



module.exports = router