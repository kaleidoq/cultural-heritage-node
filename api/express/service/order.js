const router = require('express').Router();
const mysql = require('mysql')
const models = require('../module')
const Result = require('../util/Result')
const util = require('util')

const db = mysql.createPool(models.mysql)

// 对mydql的query进行promise化，能够解决回调地狱的问题
db.queryAsync = util.promisify(db.query)

/**
 * 获得用户的收货信息
 * @param(user_id)
 *@returns(收货人信息，地址电话等)
 */
router.get('/getConsignee', async (req, res) => {
    const user = req.body.userID
    let sql = `select * from consignee where user_id =${user};`
    const mes = await db.queryAsync(sql)
    // console.log(mes)
    new Result(mes, '收货人信息获取成功').success(res)
})

/**
 * 编辑用户的收货地址
 * @param(user_id，form)
 * @returns()
 */
router.post('/editConsignee', async (req, res) => {
    const user = req.body.userID
    const data = req.body
    let sql = ''
    if (data.cgn_id) {
        id = data.cgn_id
        sql = `update consignee t set t.name ='${data.name}', t.region ='${data.region}',
         t.address = '${data.address}', t.tel = '${parseInt(data.tel)}' where t.cgn_id = ${data.cgn_id};`
    } else {
        sql = `insert into consignee (user_id, name, region, address, tel)
            values (${user},'${data.name}','${data.region}','${data.address}',${parseInt(data.tel)});`
    }
    const mes = await db.queryAsync(sql)
    if (data.is_default) {
        let id = -1
        if (data.cgn_id) id = data.cgn_id
        else id = mes.insertId
        changeDefult(user, id)
    }
    new Result('地址添加成功').message(res)
})

/**
 * 修改默认地址
 * @param(用户id，默认地址id)
 * @returns()
 */
async function changeDefult(user, id) {
    let sql = `update consignee set is_default = false where user_id=${user};
            update consignee set is_default = true where cgn_id=${id};`
    let mes = await db.queryAsync(sql)
    console.log(mes, '修改默认')
}


/**
 * 删除用户的收货地址
 * @param(cgn_id)
 * @returns(msg)
 * @method(delete)
 */
router.delete('/delConsignee', async (req, res) => {
    const user = req.body.userID
    const data = req.body
    // let sql = `delete from consignee where cgn_id = ${data.cgn_id};`
    let sql = `update consignee set is_del = true where cgn_id=${data.cgn_id};`
    const mes = await db.queryAsync(sql)
    if (mes.affectedRows == 1) {
        new Result('成功删除地址信息').message(res)
    } else
        new Result('地址删除失败').message(res)
})

/**
 * 获得用户的默认收货地址
 * @param()
 * @returns(地址)
 * @method(get)
 */
router.get('/getDefCgn', async (req, res) => {
    const user = req.body.userID
    let sql = `select * from consignee where user_id =${user} and is_default=1;`
    const mes = await db.queryAsync(sql)
    new Result(mes[0], '地址获取成功').success(res)
})

/**
 * 发起订单
 * @param(goods_id,cgn_id)
 * @returns(订单状态)
 * @method(post)
 */
router.post('/initOrder', async (req, res) => {
    const user = req.body.userID
    const data = req.body
    let sql = `insert into order_list
    (goods_id, seller_user_id, buyer_user_id, is_pay, price, status, cgn_id)
                values (${data.goods_id},${data.seller_user_id},${user},1,${data.price},1,${data.cgn_id});
                update goods_info set is_promote = 1 where goods_id=${data.goods_id};`
    const mes = await db.queryAsync(sql)
    // console.log(mes)
    let insertId = mes[0].insertId
    new Result(insertId, '订单成功发起').success(res)
})


/**
 * 查看订单信息
 * @param(cgn_id)
 * @returns()
 * @method(get)
 */
router.get('/getOrderDesc', async (req, res) => {
    const id = req.query.order_id
    let sql = `select * from order_desc_list where order_id = ${id};`
    const mes = await db.queryAsync(sql)
    console.log(mes[0])
    new Result(mes[0], '订单详情查看成功').success(res)
})


/**
 * 获取该用户的全部订单信息
 * @param()
 * @returns(订单信息)
 * @method(get)
 */
router.get('/queryOrder', async (req, res) => {
    const user = req.body.userID
    let sql = `select * from order_desc_list where buyer_user_id = ${user};`
    const mes = await db.queryAsync(sql)
    console.log(mes)
    new Result(mes, '订单列表查看成功').success(res)
})

module.exports = router