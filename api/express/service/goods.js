const router = require('express').Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)

// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)


// 删除文章（实际不删除，设置idDel=1
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

module.exports = router