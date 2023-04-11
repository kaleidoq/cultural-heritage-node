const AlipaySdk = require('alipay-sdk');
// TypeScript，可以使用 import AlipaySdk from 'alipay-sdk';
// 普通公钥模式
const alipaySdk = new AlipaySdk({
    appId: '2016123456789012',
    privateKey: fs.readFileSync('private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('alipay-public-key.pem', 'ascii'),
});

/* // 小程序：生成二维码
const result = await alipaySdk.exec('alipay.open.public.qrcode.create');

// 生活号：基础信息查询
const result = await alipaySdk.exec('alipay.open.public.info.query');

// 第三方应用：查询应用授权信息。需要先给第三方应用授权：https://opendocs.alipay.com/isv/04h3ue
const result = await alipaySdk.exec('alipay.open.auth.token.app.query', {
    bizContent: { app_auth_token: 'token 请在开放平台上查询' }
}); */