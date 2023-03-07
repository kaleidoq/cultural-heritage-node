/**
 *@descript 将时间戳或new Date()得到的时间转化成yyyymmddhhmmss形式
 */
class LocalTime {
    // localTime(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    //         if (!data) return ''
    //         if (typeof date !== 'object' || !(date instanceof Date) {
    //                 date = new Date(date)
    //             }
    //             let o = {
    //                 'M+': date.getMonth() + 1, // 月份
    //                 'd+': date.getDate(), // 日
    //                 'H+': date.getHours(), // 小时
    //                 'm+': date.getMinutes(), // 分
    //                 's+': date.getSeconds(), // 秒
    //                 'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    //                 'S': date.getMilliseconds() // 毫秒
    //             }
    //             if (/(y+)/.test(fmt)) {
    //                 fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    //             }
    //             for (let k in o) {
    //                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k].length)))
    //                 }
    //                 return fmt.replace(/\D+/g, '')
    //             }


    //获得精确到天的方法
    getDate(date) {
        //date是传过来的时间戳，注意需为13位，10位需*1000
        //也可以不传,获取的就是当前时间
        var time = new Date(date);
        var year = time.getFullYear() //年
        var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
        var day = ("0" + time.getDate()).slice(-2); //日
        var mydate = year + "-" + month + "-" + day;
        return mydate
    }


}




export default new LocalTime()