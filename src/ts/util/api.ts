
const APP_ENV = process.env.NODE_ENV || 'production';
// 非生产环境，将 index.html 导进来，从而达到修改 html 文件的时候触发 reload
if (APP_ENV !== 'production') {
    // require('../../index.html');
} else {
    console.log = function () { };
    console.dir = function () { };
}
console.log('当前环境：' + APP_ENV);

let requestHost = '';

switch (APP_ENV) {
    case 'development':
        // 开发环境
        requestHost = '//127.0.0.1:4000';   // 本机模拟的后端接口 host 
        // requestHost = '//sit.guanghuobao.com';
        break;
    case 'test':
        // 测试环境
        requestHost = '//sit.guanghuobao.com';
        break;
    case 'ready':
        // 仿真/预生产
        requestHost = '';
        break;
    case 'production':
        // 正式/生产
        requestHost = '//www.guanghuobao.com';
        break;
}

const api = {
    // 获取微信 js-sdk 参数
    wechatjs: requestHost + '/shop/common/wechat/jssdk_params',
    // 获取当前用户抽奖信息
    get: requestHost + '/api/v1/activity/2018/march/get',
    // 抽奖接口
    lottery: requestHost + '/api/v1/activity/2018/march/lottery',
    // 提交接口
    submit: requestHost + '/api/v1/decLotteryActivity/submit',
    // 红包领取接口
    draw: requestHost + '/api/v1/decLotteryActivity/draw'
};

export { api };