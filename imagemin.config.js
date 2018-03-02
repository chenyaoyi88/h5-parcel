const fs = require('fs');
const filesize = require('filesize');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const chalk = require('chalk');
// png 图片质量控制
const quality_png = '80-90';
// 默认是测试环境打包出来的文件夹
let sImageminDir = 'dist_test';

if (process.env.NODE_ENV === 'production') {
    sImageminDir = 'dist_prod';
}

fnReadDirFile(sImageminDir, {
    filter: fnImageFilter
}, function (err, fileListBefore) {

    (async function () {
        try {
            await imagemin([`${sImageminDir}/*.{jpg,png}`], sImageminDir, {
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: quality_png
                    })
                ]
            });

            fnReadDirFile(sImageminDir, {
                filter: fnImageFilter
            }, function (err, fileListAfter) {
                const aImageCompare = fnImageCompare(fileListBefore, fileListAfter);
                fnShowImageSizeCompare(aImageCompare);
                chalk.green('图片优化完成');
            });

        } catch (err) {
            console.log(chalk.red('图片优化失败'), err);
        }
    })();

});

/**
 * 控制台显示图片大小对比
 * 
 * @param {any} arr 所有图片的数组
 */
function fnShowImageSizeCompare(arr) {
    let sBefore = 0;
    let sAfter = 0;
    console.log(' ');
    arr.forEach((file, index) => {
        sBefore += parseFloat(file.before);
        sAfter += parseFloat(file.after);
        console.log(file.name);
        console.log(
            chalk.yellow(filesize(file.before)) + ' → ' + chalk.green(filesize(file.after)),
            '↓' + chalk.green(((1 - (file.after / file.before)) * 100).toFixed(2) + '%')
        );
    });
    console.log(' ');
    console.log(chalk.green('图片优化完成'));
    console.log(
        chalk.yellow(filesize(sBefore)) + ' → ' + chalk.green(filesize(sAfter)),
        '↓' + chalk.green(((1 - (sAfter / sBefore)) * 100).toFixed(2) + '%')
    );

}

/**
 * 递归查找图片过滤条件
 * 
 * @param {any} file 文件
 * @param {any} stats 文件信息
 * @returns true 过滤，false 不过滤
 */
function fnImageFilter(file, stats) {
    if (/jp(e)?g|png/gi.test(file)) {
        return {
            name: file,
            size: stats.size
        };
    }
    return false;
}

/**
 * 优化器优化后对比
 * 
 * @param {any} arrBefore 图片优化前数组
 * @param {any} arrAfter 图片优化后数组
 * @returns 新的数组，里面包含优化前后的字段
 */
function fnImageCompare(arrBefore, arrAfter) {
    let arr = [];
    for (let i = 0; i < arrAfter.length; i++) {
        for (let j = 0; j < arrBefore.length; j++) {
            if (arrAfter[i].name === arrBefore[j].name) {
                let json = {
                    name: arrAfter[i].name,
                    before: arrBefore[j].size,
                    after: arrAfter[i].size
                };
                arr.push(json);
            }
        }
    }
    return arr;
}

/**
 * 递归读取文件
 * 
 */
function fnReadDirFile() {
    let fileList = [];
    let input = '';
    let options = {};
    let callback = function () {};

    if (arguments.length === 2) {
        input = arguments[0];
        callback = arguments[1];
    } else if (arguments.length === 3) {
        input = arguments[0];
        options = arguments[1];
        callback = arguments[2];
    }

    readDirRecur(input, callback);

    function readDirRecur(input, callback) {
        fs.readdir(input, function (err, files) {

            if (err) return callback(err, []);

            let count = 0;
            const checkEnd = function () {
                ++count == files.length && callback({}, fileList);
            }

            files.forEach(function (file, index) {
                const fullPath = input + '/' + file;
                fs.stat(fullPath, function (err, stats) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (stats.isDirectory()) {
                        return readDirRecur(fullPath, checkEnd);
                    } else {
                        if (options && options.filter) {
                            if (options.filter(file, stats)) {
                                fileList.push(options.filter(file, stats));
                            }
                        } else {
                            fileList.push(file);
                        }
                        checkEnd();
                    }
                });
            });

            files.length === 0 && callback({}, fileList);
        });
    }
}