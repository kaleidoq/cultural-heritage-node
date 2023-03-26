const mysql = require('mysql')
const models = require('../module')
const db = mysql.createPool(models.mysql)

// const query = util.promisify(db.query)


// function promisify(func) {
//     return function(...args) {
//         return new Promise((resolve, reject) => {
//             let callback = function(...args) {
//                     resolve(args)
//                 }
//                 // 给func函数主动塞入一个callback，这样在func中调用callback的时候实际执行的时候就是
//                 // 我们这里定义的callback函数，然后在我们的callback中调用resolve,
//                 // 这样一来，本来想要通过回调执行的操作就可以放在then函数中进行执行了
//             func.apply(null, [...args, callback])
//         })
//     }
// }

/**
 * Promise化一个带回调的普通函数
 * 回调函数的第一个参数必须是Error
 * @param {Funciton} fn function to call
 * @return 返回一个Promise的函数, 即Promise化
 * 在返回的Promise里面处理fn的回调函数
 */
function promisify(fn) {
    return function (...args) {
        let _args = args.slice() // 拷贝一份参数, 原则上不应该修改传入参数的值
        return new Promise((resolve, reject) => { // 这里必须使用箭头函数, 为了获得真正的上下文
            function cb(err, ...results) { // 处理回调结果
                if (err) {
                    reject(err)
                } else {
                    // 这里util.promisify只会传err之后的第一个参数, 相当于resolve(result[0])
                    // 给resolve传递了err之外的其他所有参数, 解决缺陷!
                    resolve(results)
                }
            }
            _args.push(cb)
            fn.apply(this, _args)
            // fn.call(this, ..._args) // 也可以call
        })
    }
}


const query = promisify(db.query)


module.exports = { query }