const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')

const db = mysql.createPool(models.mysql)

// 获得热门分类信息
router.get('/getHotClassify', (req, res) => {
    const data = req.body
    // const query = req.query
    sql = `select * from classify c ,(select a.class_id, count(a.class_id)as class_count from article a
     group by a.class_id order by class_count desc) t  where t.class_id=c.class_id limit 5;`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes,);
        new Result(mes, '热门分类查询成功').success(res)
    })
})



// 获得分类分组信息
router.get('/getClassify', (req, res) => {
    const data = req.body
    // const query = req.query
    sql = `select * from classify where parent_class_id=0`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        let promiseList = []
        // 将全部的异步函数循环存入promiseList中
        let sql = `select * from classify where parent_class_id=?`
        mes.forEach(i => {
            promiseList.push(new Promise((resolve, reject) => {
                db.query(sql, [i.class_id], (err, data) => {
                    if (err) return console.log(err.message)
                    resolve(data)
                })
            }));
        });
        //放到循环外边  因为 rspList是一个数组
        //再用Promise.all方法按顺序执行最后循环存入mes中
        Promise.all(promiseList).then((chil) => {
            chil.map((item, index) => {
                let children = []
                item.map(el => {
                    children.push(el)
                })
                mes[index].children = children
            });
            console.log(mes, "mes");
            new Result(mes, "分类列表获取完毕").success(res)
        });
    })
})



module.exports = router