const date = new Date().toGMTString();
const bucketname = ""; // 空间名
const key = ""; // 操作员
const secret = ""; // 密码
const upyunUrl = 'http://v0.api.upyun.com/'
    // key = 'image-qq';
    // secret = 'secret';
    // method = 'GET';
    // uri = '/v1/apps/';
    // Upload
app.get("/api/token/upload", (req, res) => {
    let fileName = (Math.random() * 100000000) >>> 0;
    let expiration = ((Date.now() / 1000) >>> 0) + 30 * 60; // 请求的过期时间，UNIX UTC 时间戳，单位秒。建议设为 30 分钟 http://docs.upyun.com/api/form_api/
    let method = "POST";
    let policy = base64(
        JSON.stringify({
            bucket: bucketname,
            // "save-key": "/" + fileName + "{.suffix}",
            "save-key": "/{filename}{.suffix}",
            expiration: expiration
        })
    );
    let authorization =
        "UPYUN " + key + ":" + hmacsha1(MD5(secret), method + "&/" + bucketname + "&" + policy);
    res.json({
        msg: "OK",
        code: 200,
        data: {
            authorization: authorization,
            policy: policy
        }
    });
});
// Delete
app.get('/api/token/del', (req, res) => {
    let item = req.query.item;
    let method = "DELETE"
    let authorization = "UPYUN " +
        key +
        ":" +
        hmacsha1(MD5(secret), method + '&/' + bucketname + item + '&' + date);
    axios({
        url: upyunUrl + bucketname + item,
        method: 'DELETE',
        headers: {
            'Authorization': authorization,
            'Date': date
        }
    }).then(response => {
        res.json({
            msg: "OK",
            code: 200,
            data: {}
        });
    }).catch(err => {
        console.log('err', err)
    })
})