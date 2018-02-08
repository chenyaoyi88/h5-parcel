

// 返回的金额对应的位置
const proPriceMap = {
    // 金额 <-> 奖品索引（顺时针）
    '8%': 0,
    '15%': 1,
    '20%': 2,
    '30%': 3,
    '50%': 4,
    '80%': 5,
    '100%': 6,
    '188%': 7
};

// 返回的金额对应的位置
// 测试环境：（！！！！NOTE：测试环境的金额为：真实金额/100 + 1）
// 正式环境：proPriceMap
const priceMap = function () {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
        // 开发||测试
        let mockPriceMap: any = {};
        for (let pro in proPriceMap) {
            // mockPriceMap[(Number(pro) / 100 + 1)] = proPriceMap[pro];
            mockPriceMap[pro] = proPriceMap[pro];
        }
        return mockPriceMap;
    } else {
        // 生产
        return proPriceMap;
    }
}

/**
 * 测试环境设置假的金额
 * @param aLotteryUnits 
 */
const setMockPrice = function (): void {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
        let oLottery = document.querySelector('#lottery');
        let aLotteryUnits = oLottery.querySelectorAll('.lottery-unit');
        for (let i = 0; i < aLotteryUnits.length; i++) {
            let redbag = aLotteryUnits[i].getElementsByClassName('redbag-money')[0];
            let mockPriceMaps = priceMap();
            for (let pro in mockPriceMaps) {
                if (Number(mockPriceMaps[pro]) === Number(redbag['dataset'].id)) {
                    redbag.innerHTML = pro;
                }
            }
        }
    }
}

/**
 * 显示抽奖，抽奖按钮改为领取
 * @param oLotterywrap 抽奖界面
 * @param data 请求回来的数据
 * @param lottery 抽奖对象
 */
const chouChangeToLing = function (oLotterywrap: any, data, lottery: any): void {
    // 移除抽奖按钮的图片
    oLotterywrap.classList.remove('chou');
    // 变成领取按钮的图片
    oLotterywrap.classList.add('show', 'ling');
    // 如果 data.amount 为 null 的话，不在界面上显示
    let pricePos = data.amount === null ? -1 : data.amount;
    // 设置奖品位置
    lottery.index = priceMap()[pricePos];
    // 初始化抽奖
    lottery.init('lottery');
}

export { priceMap, chouChangeToLing, setMockPrice }; 
