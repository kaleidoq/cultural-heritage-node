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
 * // 获得文章的详细内容
 * @deprecated
 */
router.get('/getArticleCover', (req, res) => {
    const body = req.body
    const data = req.query
    let sql =
        `select * from cover_content where class_id in
     (select class_id from classify where parent_class_id = ?) order by create_time desc limit ? , 10`
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
                    // console.log(data)
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
 * 获得文章列表数据
 * @param { length:当前已经得到的列表长度;
 * class_id:获得的分类id;
 * state:按什么顺序排序列表（0:最新评论；1:最新发布：2:最多收藏；3:最多喜欢）;
 * }
 * @returns{list}
 */
router.get('/getArticleList', async (req, res) => {
    const user = req.body.userID
    const length = req.query.length
    const state = req.query.state
    /*     console.log(req.query, 'query')
        switch (req.query.state) {
            case 0:
                state = 'last_comment_time';
                break
            case 1:
                state = 'create_time';
                break
            case 2:
                state = 'collect_count';
                break
            case 3:
                state = 'like_count';
                break
        } */
    var sql = `select * from cover_content order by ${state} desc limit ${length} , 10`
    if (parseInt(req.query.class_id) != 0) {
        let class_id = parseInt(req.query.class_id)
        sql = `select * from cover_content where class_id = ${class_id} order by ${state} desc limit ${length} , 10`

    }
    const mes = await db.queryAsync(sql)
    var list = []
    for (let index = 0; index < mes.length; index++) {
        const item = mes[index];
        var sql = `select * from followee_user where user_id =${user} and followed_user_id =${item.user_id};
        select * from like_list where user_id =${user}  and article_id =${item.article_id};
        select * from collection_article_user where user_id =${user}  and article_id =${item.article_id}; `
        const data = await db.queryAsync(sql)
        // let user_rele = {}
        if (data[0].length != 0) item.is_follow = true
        else item.is_follow = false
        if (data[1].length != 0) item.is_like = true
        else item.is_like = false
        if (data[2].length != 0) item.is_collect = true
        else item.is_collect = false
        // console.log('item');
        list.push(item)
    }
    /*     mes.forEach(async item => {
            console.log('eeeee');
            var sql = `select * from followee_user where user_id =${user} and followed_user_id =${item.user_id};
            select * from like_list where user_id =${user}  and article_id =${item.article_id};
            select * from collection_article_user where user_id =${user}  and article_id =${item.article_id}; `
            const data = await db.queryAsync(sql)
            // let user_rele = {}
            if (data[0].length != 0) item.is_follow = true
            else item.is_follow = false
            if (data[1].length != 0) item.is_like = true
            else item.is_like = false
            if (data[2].length != 0) item.is_collect = true
            else item.is_collect = false
            console.log('item');
            list.push(item)
        }) */
    // console.log(list, 'list');
    new Result(list, '首页信息获得成功').success(res)
})

// 获得文章的详细内容
router.get('/getClassifyArticleCover', (req, res) => {
    const body = req.body
    const query = req.query
    let sql =
        `select * from cover_content where class_id in
     (select class_id from classify where parent_class_id = ?) order by create_time desc limit ? , 10`
    db.query(sql, [query.class_id, parseInt(query.length)], (err, mes) => {
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
            new Result(mes, '首页容器分类' + query.class_id + '数据获取成功').success(res)
        });
    })
})


// 获得文章的详细信息
router.get('/getArticle', (req, res) => {
    const query = req.query
    const user = req.body
    // console.log(query)
    // console.log(user)
    db.query('select * from cover_content where article_id=?', [query.article_id], (err, mes) => {
        if (err) return console.log(err.message)
        const article = mes[0]
        // console.log(article, "article")
        db.query('select images from article where article_id=?', [article.article_id], (err, data) => {
            if (err) return console.log(err.message)
            if (data[0].images != null) {
                article.images = data[0].images.split(',')
            }
            // console.log(article, 'article');
            let sql = `select * from followee_user where user_id =${user.userID} and followed_user_id =${article.user_id};
        select * from like_list where user_id =${user.userID}  and article_id =${article.article_id};
        select * from collection_article_user where user_id =${user.userID}  and article_id =${article.article_id}; `
            db.query(sql, (err, data) => {
                if (err) return console.log(err.message)
                if (data[0].length != 0) article.is_follow = true
                else article.is_follow = false
                if (data[1].length != 0) article.is_like = true
                else article.is_like = false
                if (data[2].length != 0) article.is_collect = true
                else article.is_collect = false
                // console.log(article)
                new Result(article, '文章页面详情获取成功').success(res)
            })
        })
    })
})



// 添加文章信息
router.post('/addArticle', (req, res) => {
    const body = req.body
    console.log(body)
    db.query(`insert into article (user_id, title, images, content, cover_pic, tags, class_id)
values (${body.userID}, '${body.title}', '${body.images}', '${body.content}', '${body.cover_pic}', '${body.tags}', ${body.class_id})`, (err, mes) => {
        if (err) return console.log(err)
        console.log(mes)
        new Result(mes, '文章添加成功').success(res)
    })
})



// 获得评论信息
router.get('/getComment', (req, res) => {
    const query = req.query
    // 查询父评论，也就是父亲为0 的评论
    let sql = `select * from article_comment_list where article_id=?
         and parent_comment_id = 0 order by comment_create_time desc`
    db.query(sql, [query.article_id], (err, mes) => {
        if (err) return console.log(err.message)
        // var arr = Object.values("parent_comment_id")
        let promiseList = []
        // console.log(mes, "mes");
        // 将全部的异步函数循环存入promiseList中
        // let sql = "select * from article_comment_list where parent_comment_id=?"
        let sql = "select count(*) as count from article_comment_list where parent_comment_id=?"
        mes.forEach(i => {
            promiseList.push(new Promise((resolve, reject) => {
                db.query(sql, [i.comment_id], (err, data) => {
                    if (err) return console.log(err.message)
                    resolve(data)
                })
            }));
        });
        //放到循环外边  因为 rspList是一个数组
        // 再用Promise.all方法按顺序执行最后循环存入mes中
        Promise.all(promiseList).then((chil) => {
            chil.map((item, index) => {
                // mes[index].children = item
                // mes[index].children = item
                mes[index].chilCount = item[0].count
                // console.log(mes, "mes");
            });
            new Result(mes, "评论列表获取完毕").success(res)
        });

    })
})


// 获得子评论信息
router.get('/getChilComment', (req, res) => {
    const query = req.query
    // 查询父评论，也就是父亲为0 的评论
    db.query('select * from article_comment_list where parent_comment_id=? order by comment_create_time desc', [query.parent_comment_id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes");
        new Result(mes, "子评论列表获取完毕").success(res)
    })
})


// 提交评论
router.post('/submitComment', async (req, res) => {
    const body = req.body
    console.log(body)
    let sql = `insert into article_comment(parent_comment_id, article_id, comment_content,user_id) values(?,?,?,?);
    update article set last_comment_time = now() where article_id=?;`
    // let sql = `insert into article_comment(parent_comment_id, article_id, comment_content,user_id) values(${body.parent},${body.article},${body.content},${body.userID}); `
    const mes = await db.queryAsync(sql, [body.parent, body.article, body.content, body.userID, body.article])
    new Result(mes, '文章评论成功').success(res)

    // db.query(sql, [body.parent, body.article, body.content, body.userID], (err, mes) => {
    //     if (err) return console.log(err.message)
    //     // console.log(mes, "mes")
    //     new Result(mes, '文章评论成功').success(res)
    // })
})


// 获得收藏和评论信息（x
router.get('/getCollectComment', (req, res) => {
    const query = req.query
    let sql = `SELECT *, (SELECT COUNT(*) FROM collection_article_user c
WHERE a.article_id = c.article_id) AS collect_count,
       (SELECT COUNT(*) FROM article_comment m
       WHERE m.article_id = a.article_id) AS comment_count
FROM article a;`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes");
        let info = {}
        new Result(info, "收藏和评论信息获取完毕").success(res)
    })
})


// 修改喜欢信息
router.put('/putLike', (req, res) => {
    const body = req.body
    console.log(req)
    console.log(body)
    let sql = ''
    if (body.flag) {
        sql = 'insert into like_list (user_id, article_id) values (?,?)'
    } else {
        sql = 'delete from like_list where user_id =? and article_id =?;'
    }
    db.query(sql, [body.userID, body.article_id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes");
        if (mes.affectedRows == 0)
            new Result(mes, "喜欢信息修改失败").fail(-1, res)
        else
            new Result(mes, "喜欢信息修改成功").success(res)

    })
})


// 修改收藏信息
router.put('/putCollect', (req, res) => {
    const body = req.body
    let sql = ''
    if (body.flag) {
        sql = 'insert into collection_article_user (user_id, article_id) values (?,?)'
    } else {
        sql = 'delete from collection_article_user where user_id =? and article_id =?;'
    }
    db.query(sql, [body.userID, body.article_id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes, "mes");
        if (mes.affectedRows == 0)
            new Result(mes, "收藏信息修改失败").fail(-1, res)
        else
            new Result(mes, "收藏信息修改成功").success(res)

    })
})


/**
 * 删除帖子（实际不删除，设置idDel=1
 * @param(article_id)
 */
router.delete('/delectArticle', async (req, res) => {
    const data = req.body //获得传递过来的数据
    let sql = `update article set is_del=1 where article_id=?;`
    const mes = await db.queryAsync(sql, [data.article_id])
    if (mes.affectedRows = 1) {
        new Result('文章删除成功').message(res)
    } else {
        new Result('文章删除失败').fail(404, res)
    }
})

module.exports = router