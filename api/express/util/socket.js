// // 服务器端
// let WBSokcet = require("ws").Server;
// let ws = new WBSokcet({ port: 9090 });
// let clients = [];

// ws.on("connection", function (client) {
//     // 有人链接了
//     // 把client保存到数组里
//     clients.push(client);
//     // 客户端（用send函数）发送信息后，会触发message事件
//     client.on("message", function (str) {
//         console.log("str", str);
//         // 把收到的信息，分发给其它客户端
//         broadcast(str);
//     })
// });

// // 把收到的信息分发给所有的客户端
// function broadcast(str) {
//     console.log("broadcast");
//     clients.forEach(item => {
//         // 给某个客户端发送信息
//         item.send(str);
//     });
// }



// // //这里改成你的ip端口号与server.js相对于
// // let ws = new WebSocket("ws://192.168.1.4:9090/");
// // // 链接建立打开后
// // ws.onopen = function () {
// //     ws.send("大家好");
// // }
// // // 服务器端发送信息（用send函数）后，触发onmessage事件
// // ws.onmessage = function (event) {
// //     console.log("event", event);
// //     // 把str放在html页面上。
// //     chatroom.innerHTML += event.data + "<br/>"
// // }


// // var WebSocket = require('ws');
// // var WebSocketServer = WebSocket.Server,
// //     wss = new WebSocketServer({ port: 8181, host: '127.0.0.1' });
// // //wss = new WebSocket("ws://192.168.13.77:8181");

// // var uuid = require('node-uuid');
// // var clients = [];

// // // 定义模板引擎
// // app.engine('html', function (filePath, options, callback) {
// //     fs.readFile(filePath, function (err, content) {
// //         if (err) return callback(new Error(err));
// //         var rendered = content.toString().replace('#title#', '<title>' + options.title + '</title>');
// //         return callback(null, rendered);
// //     })
// // });

// // // 指定视图所在的位置
// // app.set('views', './views');
// // // 注册模板引擎
// // app.set('view engine', 'html');
// // app.use(express.static('./asset'));

// // // app.get('/', function (req, res) {
// // //     res.render('index', { title: '聊天室' });
// // // })

// // // var server = app.listen(3000, '127.0.0.1', function () {
// // //     var host = server.address().address;
// // //     var port = server.address().port;
// // //     console.log('Example app listening at http://%s:%s', host, port);
// // // });

// // function wsSend(type, client_uuid, nickname, message) {
// //     for (var i = 0; i < clients.length; i++) {
// //         var clientSocket = clients[i].ws;
// //         if (clientSocket.readyState === WebSocket.OPEN) {
// //             clientSocket.send(JSON.stringify({
// //                 "type": type,
// //                 "id": client_uuid,
// //                 "nickname": nickname,
// //                 "message": message
// //             }));
// //         }
// //     }
// // }

// // var clientIndex = 1;
// // wss.on('connection', function (ws) {
// //     var client_uuid = uuid.v4();
// //     var nickname = "游客" + clientIndex;
// //     clientIndex += 1;
// //     clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });
// //     console.log('client [%s] connected', client_uuid);
// //     var connect_message = nickname + " 加入聊天室";

// //     wsSend("notification", client_uuid, nickname, connect_message);
// //     console.log('client [%s] connected', client_uuid);

// //     ws.on('message', function (message) {
// //         if (message.indexOf('/nick') === 0) {
// //             var nickname_array = message.split(' ');
// //             if (nickname_array.length >= 2) {
// //                 var old_nickname = nickname;
// //                 nickname = nickname_array[1];
// //                 var nickname_message = "Client " + old_nickname + " changed to " + nickname;
// //                 wsSend("nick_update", client_uuid, nickname, nickname_message);
// //             }
// //         } else {
// //             wsSend("message", client_uuid, nickname, message);
// //         }
// //     });
// //     var closeSocket = function (customMessage) {
// //         for (var i = 0; i < clients.length; i++) {
// //             if (clients[i].id == client_uuid) {
// //                 var disconnect_message;
// //                 if (customMessage) {
// //                     disconnect_message = customMessage;
// //                 } else {
// //                     disconnect_message = nickname + " has disconnected";
// //                 }
// //                 wsSend("notification", client_uuid, nickname, disconnect_message);
// //                 clients.splice(i, 1);
// //             }
// //         }
// //     };
// //     ws.on('close', function () {
// //         closeSocket();
// //     });
// //     process.on('SIGINT', function () {
// //         console.log("Closing things");
// //         closeSocket('Server has disconnected');
// //         process.exit();
// //     });
// // });


// module.exports = ws






















// var express = require('express');
// var fs = require('fs');
// var app = express();
// var WebSocket = require('ws');
// var WebSocketServer = WebSocket.Server,
//     wss = new WebSocketServer({ port: 8181, host: '127.0.0.1' });
// //wss = new WebSocket("ws://192.168.13.77:8181");

// var uuid = require('node-uuid');
// var clients = [];

// // 定义模板引擎
// app.engine('html', function (filePath, options, callback) {
//     fs.readFile(filePath, function (err, content) {
//         if (err) return callback(new Error(err));
//         var rendered = content.toString().replace('#title#', '<title>' + options.title + '</title>');
//         return callback(null, rendered);
//     })
// });


// // 指定视图所在的位置
// app.set('views', './views');
// // 注册模板引擎
// app.set('view engine', 'html');
// app.use(express.static('./asset'));

// app.get('/', function (req, res) {
//     res.render('index', { title: '聊天室' });
// })

// var server = app.listen(3000, '127.0.0.1', function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// });


// function wsSend(type, client_uuid, nickname, message) {
//     for (var i = 0; i < clients.length; i++) {
//         var clientSocket = clients[i].ws;
//         if (clientSocket.readyState === WebSocket.OPEN) {
//             clientSocket.send(JSON.stringify({
//                 "type": type,
//                 "id": client_uuid,
//                 "nickname": nickname,
//                 "message": message
//             }));
//         }
//     }
// }

// var clientIndex = 1;
// wss.on('connection', function (ws) {
//     var client_uuid = uuid.v4();
//     var nickname = "游客" + clientIndex;
//     clientIndex += 1;

//     clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });
//     console.log('client [%s] connected', client_uuid);
//     var connect_message = nickname + " 加入聊天室";

//     wsSend("notification", client_uuid, nickname, connect_message);
//     console.log('client [%s] connected', client_uuid);

//     ws.on('message', function (message) {
//         if (message.indexOf('/nick') === 0) {
//             var nickname_array = message.split(' ');
//             if (nickname_array.length >= 2) {
//                 var old_nickname = nickname;
//                 nickname = nickname_array[1];
//                 var nickname_message = "Client " + old_nickname + " changed to " + nickname;
//                 wsSend("nick_update", client_uuid, nickname, nickname_message);
//             }
//         } else {
//             wsSend("message", client_uuid, nickname, message);
//         }
//     });
//     var closeSocket = function (customMessage) {
//         for (var i = 0; i < clients.length; i++) {
//             if (clients[i].id == client_uuid) {
//                 var disconnect_message;
//                 if (customMessage) {
//                     disconnect_message = customMessage;
//                 } else {
//                     disconnect_message = nickname + " has disconnected";
//                 }
//                 wsSend("notification", client_uuid, nickname, disconnect_message);
//                 clients.splice(i, 1);
//             }
//         }
//     };
//     ws.on('close', function () {
//         closeSocket();
//     });
//     process.on('SIGINT', function () {
//         console.log("Closing things");
//         closeSocket('Server has disconnected');
//         process.exit();
//     });
// });


// module.exports = function (server) {
//     const io = require('socket.io')(server)
//     io.listen(4001)
//     console.log('客户端连接上了服务器')

//     //监视客户端与服务器的连接
//     io.on('connection', function (socket) {
//         console.log('客户端连接上了服务器')
//     })
// }

module.exports =
    //     function (io) {

    //     io.on('connect', onConnect);
    // }

    function onConnect(socket) {

        // 发送给当前客户端
        socket.emit(
            'hello',
            'can you hear me?',
            1,
            2,
            'abc'
        );

        // 发送给所有客户端，除了发送者
        socket.broadcast.emit(
            'broadcast',
            'hello friends!'
        );

        // 发送给同在 'game' 房间的所有客户端，除了发送者
        socket.to('game').emit(
            'nice game',
            "let's play a game"
        );

        // 发送给同在 'game1' 或 'game2' 房间的所有客户端，除了发送者
        socket.to('game1').to('game2').emit(
            'nice game',
            "let's play a game (too)"
        );

        // 发送给同在 'game' 房间的所有客户端，包括发送者
        io.in('game').emit(
            'big-announcement',
            'the game will start soon'
        );

        // 发送给同在 'myNamespace' 命名空间下的所有客户端，包括发送者
        io.of('myNamespace').emit(
            'bigger-announcement',
            'the tournament will start soon'
        );

        // 发送给指定 socketid 的客户端（私密消息）
        // socket.to(<socketid>).emit(
        //     'hey',
        //     'I just met you'
        // );

        // 包含回执的消息
        socket.emit(
            'question',
            'do you think so?',
            function (answer) { }
        );

        // 不压缩，直接发送
        socket.compress(false).emit(
            'uncompressed',
            "that's rough"
        );

        // 如果客户端还不能接收消息，那么消息可能丢失
        socket.volatile.emit(
            'maybe',
            'do you really need it?'
        );

        // 发送给当前 node 实例下的所有客户端（在使用多个 node 实例的情况下）
        io.local.emit(
            'hi',
            'my lovely babies'
        );
    };