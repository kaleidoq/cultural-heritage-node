// var router = function (app) {
//     app.get('/one', function (req, res) {
//         res.write("ddd");
//         res.end();
//     });

//     var net = require('net');
//     var port = 8081;
//     var host = '127.0.0.1';
//     var client = new net.Socket();
//     //客户端连接
//     client.connect(port, host, function () {
//         //客户端向服务端socket发送数据
//         client.write('向服务器发送数据I am Chuck Norris!');
//     });

//     // 为客户端添加“data”事件处理函数
//     // data是服务器发回的数据
//     client.on('data', function (data) {
//         console.log("从服务器接受的数据" + data + "     \n");
//     });

//     // 为客户端添加“close”事件处理函数
//     client.on('close', function () {
//         console.log('客户端Connect closed');
//     });
// };
// exports.router = router;

var router = function (app, io) {
    app.get('/one', function (req, res) {
        console.log('进入router.js文件')

        // res.sendFile("/Users/wofu/Desktop/node/views/one.html");
        // res.write("ddd");
    });
};

exports.router = router;