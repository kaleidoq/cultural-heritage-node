const fs = require('fs')


// const fs = require("fs");
const mineType = require("mime-types");

// var request = require('request');
var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // AppId: '1***********4',
    // SecretId: 'A************************u',
    // SecretKey: '7************************H',
    APPID: '1316814352',
    SecretId: 'AKIDFFyRcefSNnxpRotiKhoodC5h5D8xYu0v',
    SecretKey: 'pNhmdEl6B0Zu40g7JFxQeeQwBBuRknbM',
    // getAuthorization: function(options, callback) {
    //     // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    //     // 异步获取临时密钥
    //     request({
    //         url: 'https://example.com/sts',
    //         data: {
    //             // 可从 options 取需要的参数
    //         }
    //     }, function(err, response, body) {
    //         try {
    //             var data = JSON.parse(body);
    //             var credentials = data.credentials;
    //         } catch (e) {}
    //         if (!data || !credentials) return console.error('credentials invalid');
    //         callback({
    //             TmpSecretId: credentials.tmpSecretId, // 临时密钥的 tmpSecretId
    //             TmpSecretKey: credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
    //             SecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
    //             ExpiredTime: data.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
    //         });
    //     });
    // }
});


function blobToBase64(blob, callback) {
    // const fileReader = new FileReader();

    // fileReader.onload = (e) => {
    //     callback(e.target.result);
    // };
    // fileReader.readAsDataURL(blob);


    let imgurl = blob;
    let imageData = fs.readFileSync(imgurl);
    if (!imageData) return "";
    let bufferData = Buffer.from(imageData).toString("base64");
    let base64 = "data:" + mineType.lookup(imgurl) + ";base64," + bufferData;
    // return base64;
    callback(base64)
}


const filePath = "F:\\uniapp\\diy-shop\\api\\express\\util\\img_5.jpg" // 本地文件路径
function put(filePath) {
    console.log(filePath)
    const datetime = new Date().getTime()
    // blobToBase64(blob, (dataurl) => {
    //     filePath = dataurl;
    //     console.log("base64", filePath);
    // });
    cos.putObject({
        Bucket: 'img-kaleido-1316814352',
        /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-guangzhou',
        /* 存储桶所在地域，例如 ap-beijing，必须字段 */
        Key: datetime + '.jpg',
        /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        /* 当 Body 为 stream 类型时，ContentLength 必传，否则 onProgress 不能返回正确的进度信息 */
        Body: fs.createReadStream(filePath), // 上传文件对象
        ContentLength: fs.statSync(filePath).size,
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        }
    }, function (err, data) {
        console.log(err || data);
    });
}



function uploadBase64(base64Url) {
    const datetime = new Date().getTime()

    // 上传base64作为文件内容：
    // var base64Url = 'data:image/png;base64,iVBORw0KGgo.....';
    // 需要转为 Buffer上传
    var body = Buffer.from(base64Url.split(',')[1], 'base64');
    const res = cos.putObject({
        Bucket: 'img-kaleido-1316814352',
        /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-guangzhou',
        /* 必须 */
        Key: datetime + '.jpg',
        /* 必须 */
        Body: body,
        // }  , function (err, data) {
        //     console.log(err || data);
        //     return data
    });
    console.log(res, 'res');
    return res
}

module.exports = { put, uploadBase64 }


// put()