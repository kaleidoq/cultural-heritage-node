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
 * 获得文章信息
 * @return {article_id}
 */
router.get('/getArticle', async (req, res) => {
    const data = req.query
    // const query = req.query
    sql = `select a.*,c.class_name from article a,classify c
    where article_id =${data.article_id} and a.class_id=c.class_id;`
    const mes = await db.queryAsync(sql)
    new Result(mes[0], "文章信息获取完毕").success(res)
})


/**
 * 修改文章的审核信息（改为已审核
 * @return {article_id}
 */
router.post('/setAudit', async (req, res) => {
    const data = req.body
    // const query = req.query
    sql = `update article set is_audit = 1
    where article_id =${data.article_id};`
    const mes = await db.queryAsync(sql)
    new Result(mes, "审核信息修改完毕").success(res)
})



/**
 *  删除个人信息
 *  @param {article_id}
 *  @returns(mes)
 */
router.post('/deleteArticle', async (req, res) => {
    const id = req.body.article_id //获得传递过来的数据
    // console.log(req.body, 'req.body');
    let sql = `update article set is_del=1 where article_id=${id};`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes, '删除文章成功！').success(res)
})


/**
 *  删除个人信息
 *  @param {user_id}
 *  @returns(mes)
 */
router.post('/deleteUser', async (req, res) => {
    const user = req.body.user_id //获得传递过来的数据
    console.log(req.body, 'req.body');
    let sql = `update user_info set is_del=1 where user_id=${user};`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes, '删除用户成功！').success(res)
})

/**
 *  获得个人信息
 *  @param {user_id}
 *  @returns(mes)
 */
router.get('/getUser', async (req, res) => {
    const user = req.query.user_id //获得传递过来的数据
    console.log(user, 'req.body');
    let sql = `select nickname,head,introduce from user_info where user_id =${user};`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes[0], '获得用户头像成功！').success(res)
})

/**
 *  获得个人文章信息信息
 *  @param {user_id}
 *  @returns(mes)
 */
router.get('/getUserArticle', async (req, res) => {
    const user = req.query.user_id //获得传递过来的数据
    let sql = `select a.*,c.class_name from article a,classify c
    where user_id =${user} and a.class_id=c.class_id order by create_time desc;`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes, '获得用户文章信息成功！').success(res)
})

/**
 *  获得个人订单信息
 *  @param {user_id}
 *  @returns(mes)
 */
router.get('/getUserOrder', async (req, res) => {
    const user = req.query.user_id //获得传递过来的数据
    let sql = `select * from order_list
    where buyer_user_id =${user} order by create_time desc;`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes, '获得用户订单信息成功！').success(res)
})


/**
 *  获得个人订单信息
 *  @param {user_id}
 *  @returns(mes)
 */
router.get('/getUserGood', async (req, res) => {
    const user = req.query.user_id //获得传递过来的数据
    let sql = `select * from goods_info
    where user_id =${user} order by create_time desc;`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes, '获得用户商品信息成功！').success(res)
})

/**
 *  获得商品信息信息
 *  @param {goods_id}
 *  @returns(mes)
 */
router.get('/getGood', async (req, res) => {
    const good = req.query.goods_id //获得传递过来的数据
    let sql = `select g.*,c.class_name from goods_info g,classify c
    where goods_id =${good} and g.class_id=c.class_id`
    const mes = await db.queryAsync(sql)
    console.log(mes);
    new Result(mes[0], '获得商品信息成功！').success(res)
})

/**
 * 修改分类名称
 * @return {class_id,class_name,type}
 */
router.post('/editClassify', async (req, res) => {
    const data = req.body
    let sql = ''
    if (data.type == 'edit')
        sql = `update classify set class_name = '${data.class_name}' where class_id = ${parseInt(data.class_id)}`
    else
        sql = `insert into classify (class_name) values ('${data.class_name}');`
    const mes = await db.queryAsync(sql)
    new Result(mes, "分类修改完毕").success(res)
})


/**
 * 删除分类名称
 * @return {class_id}
 */
router.post('/deleteClassify', async (req, res) => {
    const data = req.body
    let sql = `delete from classify where class_id = ${parseInt(data.class_id)}`
    const mes = await db.queryAsync(sql)
    new Result(mes, "分类删除完毕").success(res)
})




module.exports = router