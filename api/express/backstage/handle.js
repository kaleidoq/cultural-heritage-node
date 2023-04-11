const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)
// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)

// 获得文章的详细内容
router.get('/getArticleCover', (req, res) => {
    const body = req.body
    const data = req.query
    db.query('select * from cover_content order by create_time desc limit ? ,10', [parseInt(data.length)], async (err, mes) => {
        if (err) return console.log(err.message)
        let promiseList = []
        // 将全部的异步函数循环存入promiseList中
        // let sql = "select * from article_comment_list where parent_comment_id=?"
        // 判断这个文章的作者是否为自己关注的
        // let sql = 'select * from followee_user where user_id =? and followed_user_id =?;'
        mes.forEach(item => {
            let sql = `select * from followee_user where user_id =${body.userID} and followed_user_id =${item.user_id};
        select * from like_list where user_id =${body.userID}  and article_id =${item.article_id};
        select * from collection_article_user where user_id =${body.userID}  and article_id =${item.article_id}; `
            promiseList.push(new Promise((resolve, reject) => {
                db.query(sql, (err, data) => {
                    if (err) return console.log(err.message)
                    let user_rele = {}
                    console.log(data)
                    if (data[0].length != 0) user_rele.is_follow = true
                    else user_rele.is_follow = false
                    if (data[1].length != 0) user_rele.is_like = true
                    else user_rele.is_like = false
                    if (data[2].length != 0) user_rele.is_collect = true
                    else user_rele.is_collect = false
                    resolve(user_rele)
                })
            }));
        });
        //放到循环外边  因为 rspList是一个数组
        // 再用Promise.all方法按顺序执行最后循环存入mes中
        Promise.all(promiseList).then((chil) => {
            chil.map((item, index) => {
                // console.log(item, "item");
                mes[index].is_follow = item.is_follow
                mes[index].is_like = item.is_like
                mes[index].is_collect = item.is_collect
                // console.log(mes, "mes");
            });
            new Result(mes, '首页容器内数据获取成功').success(res)
        });
    })
})


/**
 *  获得用户的相关数据
 *  @param()
 */
router.get('/queryArticleList', async (req, res) => {
    const data = req.query
    const list = {}
    let sql = `select count(*) as total from article where is_del=0`
    const total = await db.queryAsync(sql)
    list.total = total[0].total
    // console.log(list);
    if (data.query != '')
        // sql = `select * from article where is_del=0 and ${data.column} like '%${data.query}%' limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize}`
        // else sql = `select * from article where is_del=0 limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize}`
        sql = `select a.*, c.class_name from article a, classify c where is_del=0 and ${data.column} like '%${data.query}%'
    and a.class_id = c.class_id order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize} `
    else sql = `select a.*, c.class_name from article a, classify c where is_del=0
    and a.class_id = c.class_id order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize} `
    const mes = await db.queryAsync(sql)
    // for (let index = 0; index < mes.length; index++) {
    //     const item = mes[index];
    //     sql = `select class_name from classify where class_id = ${item.class_id}`
    //     const class_name = await db.queryAsync(sql)
    //     item.class_name = class_name[0].class_name
    // }
    list.list = mes
    new Result(list, '文章数据获取成功').success(res)
})


// 获得用户的相关数据
router.get('/queryUserInfoList', async (req, res) => {
    const data = req.query
    // const body = req
    // console.log(data, 'data');
    const list = {}
    let sql = `select count(*) as total from user_info where is_del=0`
    const total = await db.queryAsync(sql)
    list.total = total[0].total
    // console.log(list);
    if (data.query != '')
        sql = `select * from user_info where is_del=0 and ${data.column} like '%${data.query}%' order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize}`
    else sql = `select * from user_info where is_del=0 order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize}`
    const mes = await db.queryAsync(sql)
    list.list = mes
    new Result(list, '用户数据获取成功').success(res)

    // console.log(mes)

    // db.query(`select * from user_info where is_del=0 limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize}`, (err, mes) => {
    //     if (err) return console.log(err.message)
    //     new Result(mes, '用户数据获取成功').success(res)
    // })

})


/**
 * 获得商品列表
 * @param {column,query,pagenum,pagesize}
 */
router.get('/getGoodsList', async (req, res) => {
    const data = req.query
    const list = {}
    let sql = ''
    if (data.query != '')
        sql = `select count(*) as total from goods_info where is_del=0 and ${data.column} like '%${data.query}%'`
    else sql = `select count(*) as total from goods_info where is_del=0 `
    const total = await db.queryAsync(sql)
    list.total = total[0].total
    if (data.query != '')
        sql = `select g.*,c.class_name from goods_info g,classify c where g.class_id = c.class_id and g.${data.column} like '%${data.query}%'
    order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize};`
    else sql = `select g.*,c.class_name from goods_info g,classify c where g.class_id = c.class_id
    order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize};`
    const mes = await db.queryAsync(sql)
    list.list = mes
    new Result(list, '商品获取成功').success(res)
})


/**
 * 获得订单列表
 * @param {column,query,pagenum,pagesize}
 */
router.get('/getOrderList', async (req, res) => {
    const data = req.query
    const list = {}
    let sql = `select count(*) as total from order_list where is_del=0`
    const total = await db.queryAsync(sql)
    list.total = total[0].total
    sql = `select * from order_list order by create_time desc limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize};`
    const mes = await db.queryAsync(sql)
    list.list = mes
    new Result(list, '订单列表获取成功').success(res)
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
 *  获得文章的评论信息
 *  @param {goods_id}
 *  @returns(mes)
 */
router.get('/getCommentList', async (req, res) => {
    const data = req.query //获得传递过来的数据
    let sql = ''
    if (data.query != '')
        sql = `select count(*) as total from article_comment_list where
         parent_comment_id = 0 and ${data.column} like '%${data.query}%' order by comment_create_time desc`
    else
        sql = `select count(*) as total from article_comment_list where
         parent_comment_id = 0 order by comment_create_time desc`
    let count = await db.queryAsync(sql)
    let mes = {}
    mes.total = count[0].total
    if (data.query != '')
        sql = `select * from article_comment_list where parent_comment_id = 0 and ${data.column} like '%${data.query}%' order by comment_create_time desc
          limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize};`
    else sql = `select * from article_comment_list where parent_comment_id = 0 order by comment_create_time desc
          limit ${(data.pagenum - 1) * data.pagesize},${data.pagesize};`
    const parent = await db.queryAsync(sql)
    // console.log(parent);
    const list = []
    for (let index = 0; index < parent.length; index++) {
        const item = parent[index];
        sql = `select * from article_comment_list where parent_comment_id=?
        order by comment_create_time desc`
        const children = await db.queryAsync(sql, [item.comment_id])
        item.children = children
        list.push(item)
        // console.log(item, 'item');
    }
    // parent.map(async item => {

    // })
    mes.list = list
    // console.log(list, 'list');
    // setTimeout(() => {
    new Result(mes, '获得评论信息成功！').success(res)
    // }, 1000)
})


/**
 * 获得分类名称
 * @return {label,value}
 */
router.get('/getClassify', async (req, res) => {
    sql = `select class_id, class_name from classify where parent_class_id=0`
    const mes = await db.queryAsync(sql)
    new Result(mes, "分类列表获取完毕").success(res)
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

module.exports = router