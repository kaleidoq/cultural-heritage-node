const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const txyun = require('../util/txyun')

const db = mysql.createPool(models.mysql)

// 上传照片
router.post('/uploadPic', async (req, res) => {
    const data = req.body
    // console.log(req, "req")

    // const uploadRes = await txyun.uploadBase64(data.pic)
    const uploadRes = await txyun.uploadBase64(data.pic)
    console.log(uploadRes, "uploadRes")
    const url = 'https://' + uploadRes.Location
    console.log(url, "url")
    db.query('insert into picture_list(pic_content) values(?)', [url], (err, mes) => {
        if (err) return console.log(err)
        // console.log(mes)
        // res.status(200)
        // res.send(mes)
        new Result(url, '图片上传成功').success(res)
    })

    // // const data = Object.assign({}, req.body)
    // const data = req.body
    //     // console.log(data, "datapic")
    // db.query('insert into picture_list(pic_content) values(?)', [data.pic], (err, mes) => {
    //     if (err) return console.log(err)
    //         // console.log(mes)
    //         // res.status(200)
    //         // res.send(mes)
    //     new Result(mes, '图片上传成功').success(res)
    // })
})

router.post('/dowmloadPic', (req, res) => {
    const data = req.body //Object.assign({}, req.body)

    db.query('select pic_content from picture_list where pic_id=?', [data.pic_id], (err, mes) => {
        if (err) return console.log(err)
        // console.log(data)
        // console.log(mes)
        // res.status(200)
        // res.send(mes)
        new Result(mes[0].pic_content, '图片获取成功').success(res)
    })
})

router.post('/getCoverPic', (req, res) => {
    const data = req.body //Object.assign({}, req.body)

    db.query('select pic_content from picture_list where pic_id = ?', [data.pic_id], (err, mes) => {
        if (err) return console.log(err)
        // console.log(mes, 'imgafefe')
        new Result(mes[0].pic_content, '封面图片获取成功').success(res)
    });
    // for (var i = 0; i < mes.length; i++) {
    //     console.log(el.image)
    //     if (el.image) {
    //         db.query('select pic_content from picture_list where pic_id in (?)', [el.image], (err, data) => {
    //             if (err) return console.log(err)
    //                 // console.log(data, 'imagemes')
    //             mes[i].image = data
    //             console.log(mes[i].image, 'mes[i].image')
    //         })
    //     }
    // }
});

router.post('/getAllPic', (req, res) => {
    const data = req.body //Object.assign({}, req.body)
    console.log(data, 'data')
    // const arr = data.pic_id.split(',')
    // console.log(arr, 'arr')

    db.query(`select pic_content from picture_list where pic_id in (${data.pic_id})`, (err, mes) => {
        // db.query("select * from picture_list where pic_content like ?", ['%http%'], (err, mes) => {
        if (err) return console.log(err)
        const arr = []
        mes.map(item => {
            arr.push(item.pic_content)
        })
        console.log(arr, 'arr')
        new Result(arr, '全部图片获取成功').success(res)
    });
});


router.all('/uploadPP', async (req, res) => {
    const data = req.body //Object.assign({}, req.body)

    console.log(req, "data")
    console.log(data, "data")
    const uploadRes = await txyun.put(data.pic)
    console.log(uploadRes, "uploadRes")
    const url = 'https://' + uploadRes.Location
    console.log(url, "url")
});

module.exports = router