(function (win) {
    const docEl = win.document.documentElement;
    // 设计图宽度：默认按 640 计算
    const PSD_STD = 640;
    // 换算比例
    const CALC_SCALE = 100;
    // 计算 rem
    function refreshRem() {
        docEl.style.fontSize = docEl.clientWidth / (PSD_STD / 100) + 'px';
    }

    win.addEventListener('resize', function () {
        refreshRem();
    }, false);

    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            refreshRem();
        }
    }, false);

    refreshRem();

})(window);

function json2url(json) {
    if (JSON.stringify(json) === '{}') {
        return '';
    } else {
        let url = '';
        for (let name in json) {
            url += `&${name}=${encodeURI(json[name])}`;
        }
        return `?${url.slice(1)}`;
    }
}

const ajax = {
    get: function (url, oParams) {
        return new Promise((resolve, reject) => {
            window.fetch(url + json2url(oParams))
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    post: function (url, oParams) {
        return new Promise((resolve, reject) => {
            window.fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: json2url(oParams).substring(1)
                })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}