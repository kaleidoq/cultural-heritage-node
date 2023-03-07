const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)

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


module.exports = router