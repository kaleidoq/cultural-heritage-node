// var crypto = require('crypto');

// function sign(key, secret, method, uri, date, policy = null, md5 = null) {
//     elems = [];
//     [method, uri, date, policy, md5].forEach(item => {
//         if (item != null) {
//             elems.push(item)
//         }
//     })
//     value = elems.join('&');
//     auth = hmacsha1(secret, value);
//     return `UPYUN ${key}:${auth}`;
// }

// function MD5(value) {
//     return crypto.createHash('md5').update(value).digest('hex');
// }

// function hmacsha1(secret, value) {
//     return crypto.createHmac('sha1', secret).update(value, 'utf-8').digest().toString('base64');
// }

// date = new Date().toGMTString();
// console.log(date);

// key = 'image-qq';
// secret = 'secret';
// method = 'GET';
// uri = '/v1/apps/';

// console.log(MD5('secret'));

// // 上传，处理，内容识别有存储
// console.log(sign(key, MD5(secret), method, uri, date));

// // 内容识别无存储，容器云
// console.log(sign(key, secret, method, uri, date));

const OSS = require('ali-oss')
const path = require("path")

const client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'xxxxxxxxxx',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'xxxxxxxxxxxxxxxxxx',
    accessKeySecret: 'xxxxxxxxxxxxxxxxxxxx',
    // 填写Bucket名称。
    bucket: 'xxxxxxxxxxx',
});

const headers = {
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    // 'x-oss-object-acl': 'private',
    // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.jpg。
    // 'Content-Disposition': 'attachment; filename="example.jpg"'
    // 设置Object的标签，可同时设置多个标签。
    // 'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'true',
    'Content-Type': 'image/jpg',
    'Content-Disposition': 'inline',
    'x-oss-force-download': 'false' //不知道行不行
};

async function put() {
    try {
        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        const datetime = new Date().getTime()
            // ObjectMetadata objectMetadata = new ObjectMetadata();
            // objectMetadata.setContentType(getcontentType(fileName.substring(fileName.lastIndexOf("."))));

        const result = await client.put('image' + datetime + '.png', path.normalize('F:\\uniapp\\diy-shop\\api\\express\\util\\img_5.jpg')
            // 自定义headers
            , { headers }
        );
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

// put();

function time() {
    const datetime = new Date().getTime()
    console.log(typeof(datetime))
}
// time()
