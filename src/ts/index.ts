
import '../sass/index.scss';

import { Tool, weixin } from './util';

import { lottery, lotteryChou } from './lottery';
import { getUserInfo } from './get';

import { toast, loading, modal } from '../components';
import {
    modalConfig,
    priceMap,
    setMockPrice
} from './config';

Tool.domReady(() => {

    setMockPrice();

    // 手机号码
    const oPhone = (document.getElementById('phone') as HTMLInputElement);
    // 抽奖九宫格
    const oLotterywrap = document.getElementById('lottery-wrap');

    // 抽奖次数
    const oChanceTimes = document.getElementById('chance-times');
    // 抽奖按钮
    const oBtnLottery = document.getElementById('btn-chou');

    // 初始化微信 js-sdk 配置，以及分享到朋友圈/好友功能
    // weixin.init();

    // 获取抽奖次数
    getUserInfo(oChanceTimes, oBtnLottery);

    // 集体事件
    document.addEventListener('click', function (event: any) {

        const targetID = event.srcElement['id'];

        if (targetID) {
            switch (targetID) {
                case 'download-buyer':
                    // 下载叫车端
                    Tool.appDownload('buyer');
                    break;
                case 'download-driver':
                    // 下载司机端
                    Tool.appDownload('driver');
                    break;
                case 'btn-chou':
                    console.log('click');

                    if (!window.navigator.onLine) {
                        // 离线状态/断网
                        toast('请检查您的网络');
                    } else {
                        // click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
                        if (lottery.isClick) return;

                        // 抽奖逻辑
                        lotteryChou(oPhone, function (data: any) {
                            // 一次抽奖完成后，设置click为true，可继续抽奖
                            lottery.isClick = true;
                            oBtnLottery.setAttribute('disabled', 'disabled');
                            // mock
                            data = {
                                amount: '100%'
                            };

                            // 设置金额
                            lottery.getPrice = data.amount;
                            // 根据返回的金额找相对应的位置
                            lottery.getPricePos = priceMap()[lottery.getPrice];
                            // 初始化抽奖
                            lottery.init('lottery');
                            lottery.running(function () {
                                // 结束之后的回调
                                console.log('到达');

                                oBtnLottery.removeAttribute('disabled');
                            });
                        }, function () {
                            modal.show(modalConfig({
                                code: 'error',
                                isShowAnimate: true
                            }));
                        });

                    }
                    break;
            }
        }
    });

});


