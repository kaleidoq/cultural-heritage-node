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
    sql = `select * from classify c ,(select a.classify, count(a.classify)as class_count from article a
     group by a.classify order by class_count desc) t  where t.classify=c.class_id limit 5;`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err.message)
        console.log(mes,);
        new Result(mes, '热门分类查询成功').success(res)
    })
})



module.exports = router