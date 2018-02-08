import { api, ajax, Tool } from './util';
import {
    modalConfig, priceMap,
    setMockPrice
} from './config';
import { modal } from '../components';

const lottery = {
    // 当前转动到哪个位置（-1 为起点位置，不在界面上显示）
    index: -1,
    // 总共有多少个位置
    count: 0,
    // setTimeout的ID，用clearTimeout清除
    timer: null,
    // 初始转动速度
    speed: 200,
    // 转动次数
    times: 0,
    // 转动基本次数：即至少需要转动多少次再进入抽奖环节
    cycle: 50,
    // 中奖位置（-1 是默认值，表示不在界面上显示）
    prize: -1,
    // 本对象
    obj: null,
    // 禁止重复点击
    isClick: false,
    // 红包位置
    getPricePos: -1,
    // 红包金额
    getPrice: 0,
    // 抽奖初始化
    init: function (id) {
        let oLottery = document.querySelector('#' + id);
        let aLotteryUnits = oLottery.querySelectorAll('.lottery-unit');
        let oDefaultActiveLotteryUnit = null;
        if (aLotteryUnits.length > 0) {
            this.obj = oLottery;
            this.count = aLotteryUnits.length;

            // 如果设置了默认的其实位置则点亮（-1 为不设置）
            oDefaultActiveLotteryUnit = oLottery.querySelector('.lottery-unit.lottery-unit-' + this.index);
            if (oDefaultActiveLotteryUnit) {
                oDefaultActiveLotteryUnit.classList.add('active');
            }
        }
    },
    roll: function () {
        // 设置起始位置
        let index = lottery.index;
        let count = lottery.count;
        const oLottery = lottery.obj;

        // 移除当前 active 样式名
        const preLotteryUnit = oLottery.querySelector('.lottery-unit.lottery-unit-' + lottery.index);
        preLotteryUnit && preLotteryUnit.classList.remove('active');

        // 抽奖过程中的临时索引+1，超出了个数又从头来过
        index += 1;
        if (index > count - 1) {
            index = 0;
        };

        // 点亮当前奖品，添加 active 样式
        let curLotteryUnit = oLottery.querySelector('.lottery-unit.lottery-unit-' + index);
        curLotteryUnit && curLotteryUnit.classList.add('active');

        // 替换当前选中的索引
        lottery.index = index;
        return false;
    },
    running: function (callback?: Function) {
        lottery.times += 1;
        // 转动过程调用的是 lottery 的 roll 方法，这里是第一次调用初始化
        lottery.roll();

        // 如果是抽奖完成，重置
        // 如果切奖次数 > 转动基本次数 多 15 次（超出基本次数之后延迟到达奖品的次数）
        if (lottery.times > lottery.cycle + 15 && lottery.prize == lottery.index) {

            clearTimeout(lottery.timer);
            lottery.prize = -1;
            lottery.times = 0;
            lottery.isClick = false;

            setTimeout(() => {
                callback && callback();
            }, 200);

        } else {
            if (lottery.times < lottery.cycle) {
                // 1.如果没有到达基本次数，继续跑，速度由初始的 100，慢慢由减速开始 90 80 70...
                lottery.speed -= 10;
            } else if (lottery.times == lottery.cycle) {
                // 2.如果达到了基本的次数，出奖品，但是继续跑（要多跑 20 次）
                lottery.prize = lottery.getPricePos;
            } else {
                // speed 的值加大，定时器调用间隔越慢，速度就越来越慢
                lottery.speed += 10;
            }
            // 控制最快速度
            // speed 的值越小，定时器调用间隔越快，速度就越快
            if (lottery.speed < 50) {
                lottery.speed = 50;
            };
            // 循环调用
            lottery.timer = setTimeout(function () {
                lottery.running(callback);
            }, lottery.speed);
        }
        return false;
    },
    stop: function (index) {
        this.prize = index;
        return false;
    }
};

interface Res_Lottery {
    // 返回状态码
    // NO_TIMES: 没有可抽奖次数
    // NOT_FOUND_USERD: 找不到用户
    // ACT_END: 活动已结束
    code?: string;
    // 返回信息
    msg?: string;
    // 	返回数据
    data?: any;
}

// 请求抽奖接口拿奖品结果
function lotteryChou(oPhone, fnSuccess, fnError) {
    ajax({
        type: 'POST',
        url: api.lottery,
        data: JSON.stringify({
            // name: 'cyy'
        }),
        headers: {
            'Content-Type': 'application/json',
            'authorization': Tool.getQueryString('authorization') || ''
        },
        success: function (data: Res_Lottery) {
            fnSuccess && fnSuccess(data);
        },
        error: function () {
            // 失败
            fnError && fnError();
        }
    });

}

export { lottery, lotteryChou };