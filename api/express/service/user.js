const router = require('express').Router();
const mysql = require('mysql')
const models = require('../module')
const { createToken } = require('../token.js')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)

// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)


// function foo(str1, str2, callback) {
//     setTimeout(() => {
//         console.log('setTimeout')
//         // callback函数是通过最后一个参数这个位置来识别的，与callback这个名字无关
//         callback(str1, str2)
//     }, 1000)
// }

// let aaa = util.promisify(foo)
// aaa('helfbfdbdfblo', 'world')
//     .then(res => {
//         console.log(res)
//     }).catch(err => {
//         console.log(err)

//     })


router.post('/login', (req, res) => {
    const data = req.body
    // console.log(data)
    db.query('select * from user_login where username = ?', [data.username], (err, mes) => {
        if (err) return console.log(err)
        let results = JSON.stringify(mes);
        //把results对象转为字符串，去掉 RowDataPacket
        let obj = JSON.parse(results)[0];
        //把results对象转为字符串，去掉 RowDataPacket
        console.log(obj)
        if (!obj) {
            console.log('没有账号！！！')
            new Result('没有该账号').fail(404, res)
            // res.status(404).send('没有账号！！！')
            // res.status(404).json('没有任何内容');
        } else if (data.password != obj.password) {
            console.log('密码错误！！！')
            // mes.message = "密码错误！！！"
            // res.status(403)
            // res.send({ message: '密码错误！！！' })
            new Result('密码错误').fail(404, res)
        } else {
            console.log(obj)
            // tokenjs.createToken(mes.user_id)
            const user = { userID: obj.user_id }
            console.log(user)
            let token = createToken(user)
            console.log(token)
            db.query('select head from user_info where user_id=?', [obj.user_id], (err, mes) => {
                if (err) return console.log(err.message)
                let head = mes[0].head
                new Result({ token, head }, '登录成功').success(res)
            })
        }
    })
})

// 获得用户的相关数据
router.get('/queryUserInfoList', async (req, res) => {
    const data = req.body
    db.query('select * from user_info where user_id=?', [data.userID], (err, mes) => {
        if (err) return console.log(err.message)
        new Result(mes[0], '用户数据获取成功').success(res)
    })
})

// 修改个人信息页面
router.post('/updateUserInfo', (req, res) => {
    const data = req.body //获得传递过来的数据
    let sql = `update user_info
set nickname='${data.nickname}',sex=${data.sex},birthday='${data.birthday}',head='${data.head}',introduce='${data.introduce}',address='${data.address}'
where user_id=${data.userID};`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err)
        console.log(data)
        console.log(mes)
        new Result(mes, '用户信息修改成功').success(res)

    })
})

// 查看关注信息
router.get('/getFollow', async (req, res) => {
    const query = req.query
    const body = req.body
    console.log(query);
    db.query('select * from followee_user where user_id=? and followed_user_id=?;', [body.userID, query.follower_id], (err, mes) => {
        if (err) return console.log(err.message)
        let is_follow = false
        if (mes.length != 0)
            is_follow = true
        else is_follow = false
        new Result({ is_follow }, '用户关注信息查看成功').success(res)
    })
    // if (body.flag) {
    //     db.query('insert into followee_user (user_id, followed_user_id) values (?,?)', [body.userID, query.follower_id], (err, mes) => {
    //         if (err) return console.log(err.message)
    //         new Result(mes, '用户关注信息添加成功').message(res)
    //     })
    // } else {
    //     db.query('delete from followee_user where user_id =? and followed_user_id =?; ', [body.userID, body.follower_id], (err, mes) => {
    //         if (err) return console.log(err.message)
    //         new Result(mes, '用户关注信息删除成功').message(res)
    //     })
    // }
})

// 修改关注信息
router.post('/setFollow', async (req, res) => {
    // const query = req.query
    const body = req.body
    const data = {}
    console.log(body);
    if (body.flag) {
        db.query('insert into followee_user (user_id, followed_user_id) values (?,?)', [body.userID, body.follower_id], (err, mes) => {
            if (err) return console.log(err.message)
            new Result(mes, '用户关注信息添加成功').message(res)
        })
    } else {
        db.query('delete from followee_user where user_id =? and followed_user_id =?; ', [body.userID, body.follower_id], (err, mes) => {
            if (err) return console.log(err.message)
            new Result(mes, '用户关注信息删除成功').message(res)
        })
    }
})


// 获得用户昵称头像
router.get('/getUserChatInfo', (req, res) => {
    const user = req.query
    const data = req.body
    let id = 0
    if (user.user_id == null) id = data.userID
    else id = user.user_id
    console.log(user, 'user')
    console.log(id, 'id')
    db.query('select nickname,head from user_info where user_id=?', [id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes);
        new Result(mes[0], '头像昵称获取成功').success(res)
    })
})

/**
 * 获得用户头像昵称和简介以及关注信息
 * @param(user_id)
 * @returns(nickname,head,introduce,is_follow)
 */
router.get('/getUserIntro', async (req, res) => {
    const user = req.body.userID
    const other = req.query.user_id
    let sql = `select nickname,head,introduce from user_info where user_id =${other};
                select * from followee_user where user_id=${user} and followed_user_id=${other};`
    let mes = await db.queryAsync(sql)
    let results = mes[0][0]
    if (mes[1].length === 0)
        results.is_follow = false
    else results.is_follow = true
    console.log(results)
    new Result(results, '头像昵称简介以及关注信息获取成功').success(res)
    // db.query('select nickname,head,introduce from user_info where user_id=?', [id], (err, mes) => {
    //     if (err) return console.log(err.message)
    //     // console.log(mes);
    //     new Result(mes[0], '头像昵称简介获取成功').success(res)
    // })
})



// 获得用户的具体信息
router.get('/getUserInfo', (req, res) => {
    const user = req.query
    const data = req.body
    let id = 0
    if (user.user_id == null || user.user_id == 0) id = data.userID
    else id = user.user_id
    db.query('select * from user_info where user_id=?', [id], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes);
        new Result(mes[0], 'getUser成功').success(res)
    })
})

// 获得某个用户的文章具体信息
router.get('/getUserArticle', async (req, res) => {
    const user = req.query
    const data = req.body
    let id = 0
    if (user.user_id == null || user.user_id == 0) id = data.userID
    else id = user.user_id
    console.log(user, 'user')
    console.log(id, 'id')
    // db.query('select * from cover_content where user_id=?', [id], (err, mes) => {
    //     if (err) return console.log(err.message)
    //     // console.log(mes);
    //     new Result(mes, 'getUserArticle成功').success(res)
    // })
    const mes = await db.queryAsync('select * from cover_content where user_id=? order by create_time desc', [id])
    // console.log(mes);
    new Result(mes, 'getUserArticle成功').success(res)

})

// 获得用户的关注列表
router.get('/getFollowers', (req, res) => {
    const data = req.body
    db.query('select * from follower_list where user_id=?', [data.userID], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes);
        new Result(mes, '关注列表获取成功').success(res)
    })
})

// 获得用户的粉丝列表
router.get('/getFollowedUsers', (req, res) => {
    const data = req.body
    db.query('select * from follower_list where followed_user_id=?', [data.userID], (err, mes) => {
        if (err) return console.log(err.message)
        // console.log(mes);
        new Result(mes, '粉丝列表获取成功').success(res)
    })
})



// 获得个人界面的信息
// 包括头像昵称 关注人数 粉丝人数 帖子人数
router.get('/getMineInfo', (req, res) => {
    const data = req.body //获得传递过来的数据
    let sql = `select nickname,head,introduce from user_info where user_id =${data.userID};
select count(followed_user_id) as followNum from followee_user where user_id =${data.userID};
select count(user_id) as fanNum from followee_user where followed_user_id =${data.userID};
select count(article_id) as articleNum from article where user_id =${data.userID};
select count(article_id) as collectNum from collection_article_user where user_id =${data.userID};`
    db.query(sql, (err, mes) => {
        if (err) return console.log(err)
        // console.log(data)
        // console.log(mes)
        // const info = []
        // mes.forEach((item, index) => {
        //     // console.log(item, 'item')
        //     console.log(item[0], 'item0')
        //     item = item[0]
        //     info.push(item[0])
        // });
        // console.log(info, 'info')

        // console.log(mes)
        mes.forEach((item, index) => {
            mes.splice(index, 1, item[0])
        })
        // const info = mes.flat(Infinity)
        // console.log(info)
        // const info = []

        // mes.map(item => {
        //     console.log(item)
        //     item.map(ele => {
        //         info.push(ele)
        //     })
        // })
        // console.log(info)
        new Result(mes, '个人主页信息获取成功').success(res)

    })
})


// 获得用户收藏信息
router.get('/getCollection', (req, res) => {
    const data = req.body //获得传递过来的数据
    const query = req.query
    let sql = `select a.*,c.collect_time from article a,collection_article_user c
    where a.article_id=c.article_id and c.user_id=${data.userID} order by collect_time desc;` // limit ${query.length},30
    db.query(sql, (err, mes) => {
        if (err) return console.log(err)
        new Result(mes, '个人收藏文章获取成功').success(res)

    })
})


// 删除文章（实际不删除，设置idDel=1
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