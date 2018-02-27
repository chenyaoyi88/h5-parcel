const ora = require('ora');
const chalk = require('chalk');
const browserSync = require('browser-sync');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const IP = require('internal-ip').v4.sync();

const inputText = {
    phone: '13800138000'
};

const config = {
    dir: './dist_test',
    port: 8002
};

// 启动服务器
browserSync({
    server: config.dir,
    port: config.port,
    open: false,
    notify: false
});

// 自动测试
(async () => {
    let spinner = null;
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        page.on('console', msg => console.log(msg.text()));
        // 设置模拟器
        await page.emulate(iPhone);
        // 打开网页
        await page.goto(`http://${IP}:${config.port}`);
        await page.waitFor(500);
        // 聚焦输入框
        await page.focus('#phone');
        spinner = ora('测试输入框输入数字... ').start();
        // 测试输入框输入数字
        await page.type('#phone', inputText.phone, {
            delay: 50
        });
        spinner.succeed(chalk.green('输入框输入数字-成功'));
        await page.waitFor(500);
        spinner = ora('测试输入框删除... ').start();
        // 测试输入框删除
        for (let i = 0; i < inputText.phone.length; i++)
            await page.keyboard.press('Backspace', {
                delay: 100
            });
        spinner.succeed(chalk.green('输入框删除-成功'));

        await page.waitFor(500);

        spinner = ora('测试弹窗显示文字... ').start();
        await page.click('#show-modal-text');
        await page.waitFor(1000);
        await page.click('[data-id=modal-close-btn]');
        spinner.succeed(chalk.green('弹窗显示文字-成功'));

        await page.waitFor(500);

        spinner = ora('测试弹窗显示图片文字... ').start();
        await page.click('#show-modal-img');
        await page.waitFor(1000);
        await page.click('[data-id=modal-close-btn]');
        spinner.succeed(chalk.green('弹窗显示图片文字-成功'));

        await page.waitFor(500);

        spinner = ora('测试弹窗回调... ').start();
        await page.click('#show-modal-cb');
        await page.waitFor(1000);
        await page.click('[data-id=modal-close-btn]');
        spinner.succeed(chalk.green('弹窗回调-成功'));

        await page.waitFor(500);

        spinner = ora('测试toast提示... ').start();
        await page.click('#show-toast');
        spinner.succeed(chalk.green('toast提示-成功'));

        await page.waitFor(1500);

        spinner = ora('测试loading提示... ').start();
        await page.click('#show-loading');
        spinner.succeed(chalk.green('loading提示-成功'));

        await page.waitFor(3000);
        // 关闭浏览器
        browser.close();
        process.exit(0);
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
})();