import './input_keyboard.scss';

interface Cik_options {
    // 自定义样式
    wrapClass?: string;
    // 标题
    title?: string;
    // 输入的长度（默认6位）
    len?: number;
    // 是否显示输入
    isShowInput?: boolean;
    // 是否已存在
    isExist?: boolean;
    // 不显示输入的时候显示什么东西（默认*）
    inputTag?: string;
    // 输入类型
    isNumber?: boolean;
    // 输入完成回调
    compelete?: Function;
}

const cInputKeyboard = {
    oBody: null,
    oBodyCurPos: '',
    sCikID: '',
    oCustomInputKeyboard: null,
    aCustomInputList: null,
    aInputNum: [],
    nInputNumLen: 0,
    isShowInput: false,
    isDisabled: false,
    isExist: false,
    inputTag: '*',
    // init: function (id: string, options: Cik_options) {
    init: function (options: Cik_options) {
        const wrapClass = options.wrapClass || '';
        const title = options.title || '请输入密码';
        this.nInputNumLen = options.len || 6;
        this.compelete = options.compelete;
        this.isShowInput = options.isShowInput || false;
        this.inputTag = options.inputTag || '*';

        if (this.isExist) return;

        this.sCikID = `cyy-input-keyboard-${new Date().getTime()}`;

        let sInputList: string = '';
        for (let i = 0; i < this.nInputNumLen; i++) {
            sInputList += '<strong></strong>';
        }

        document.body.insertAdjacentHTML('beforeend', `
        <div class="input-keyboard-wrap ${wrapClass}" id="${this.sCikID}">
            <div class="input-wrap" data-cikid="custom-input">
                <div class="input-num-wrap">
                    <div class="input-num-title">${title}</div>
                    <div class="input-num-list" data-cikid="custom-input-list">
                        ${sInputList}
                    </div>
                </div>
            </div>
            <div class="keyboard-wrap" data-cikid="custom-keyboard">
                <div data-ciknum="close" class="keyboard-header-wrap"></div>
                <table class="keyboard-content-wrap">
                    <tbody>
                        <tr>
                            <td data-ciknum="1">1</td>
                            <td data-ciknum="2">2</td>
                            <td data-ciknum="3">3</td>
                        </tr>
                        <tr>
                            <td data-ciknum="4">4</td>
                            <td data-ciknum="5">5</td>
                            <td data-ciknum="6">6</td>
                        </tr>
                        <tr>
                            <td data-ciknum="7">7</td>
                            <td data-ciknum="8">8</td>
                            <td data-ciknum="9">9</td>
                        </tr>
                        <tr>
                            <td class="dark"></td>
                            <td data-ciknum="0">0</td>
                            <td data-ciknum="delete" class="dark delete">x</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div data-ciknum="close" class="input-keyboard-wrap-bg"></div>
        </div>
        `);

        this.isExist = true;
        this.oBody = document.body;
    },
    show: function (options: Cik_options = {}) {

        if (!this.isExist) {
            this.init(options);
        }

        if (window.location.href.indexOf('#inputkeyboard') === -1) {
            window.history.pushState(null, null, '#inputkeyboard');
        }

        this.aInputNum = [];
        this.oCustomInputKeyboard = document.getElementById(this.sCikID);
        this.aCustomInputList = this.oCustomInputKeyboard.querySelector('[data-cikid=custom-input-list]').children;

        const scrollTop = window.pageYOffset
            || document.documentElement.scrollTop
            || this.oBody.scrollTop
            || 0;
        this.oBodyCurPos = scrollTop;
        this.oBody.style.top = -1 * scrollTop + 'px';
        this.oBody.style.position = 'fixed';

        setTimeout(() => {
            this.oCustomInputKeyboard.classList.add('show-animate');
        }, 50);

        this.handle();
    },
    handle: function () {
        document.addEventListener('click', (ev) => {
            const oEvent = ev || event;
            const oTarget = oEvent.srcElement || oEvent.target;
            if (oTarget['dataset']['ciknum']) {
                switch (oTarget['dataset']['ciknum']) {
                    case 'close':
                        this.hide();
                        break;
                    case 'delete':
                        if (this.aInputNum.length === 0 || (this.aInputNum.length === this.nInputNumLen)) return;
                        // 删除输入的值
                        this.aInputNum.pop();
                        this.setInputValue();
                        break;
                    default:
                        if (this.aInputNum.length === this.nInputNumLen) return;
                        // 保存输入的值
                        this.aInputNum.push(oTarget['dataset']['ciknum']);
                        this.setInputValue();
                        // 输入长度满足设定长度，回调抛出输入的值
                        if (this.aInputNum.length === this.nInputNumLen) {
                            setTimeout(() => {
                                this.compelete && this.compelete(this.aInputNum.join(''));
                            }, 50);
                        }
                }
            }
        }, false);

        // 监听安卓的后退键，当 url hash 有改变时，关闭输入界面
        window.addEventListener('hashchange', () => {
            if (window.location.href.indexOf('#inputkeyboard') === -1) {
                this.hide();
            }
        }, false);
    },
    hide: function (isRemove: false) {

        // 恢复位置
        this.oBody.style.overflow = '';
        this.oBody.style.position = null;
        this.oBody.style.top = null;
        window.scrollTo(0, this.oBodyCurPos);

        this.aInputNum = [];
        this.oCustomInputKeyboard.classList.remove('show-animate');
        setTimeout(() => {
            if (document.body.contains(this.oCustomInputKeyboard)) {
                this.handle = function () { };
                if (window.location.href.indexOf('#inputkeyboard') !== -1) {
                    window.history.back();
                }
                this.setInputValue();
                if (isRemove) {
                    document.body.removeChild(this.oCustomInputKeyboard);
                    this.isExist = false;
                }
            }
        }, 250);
    },
    close: function () {
        this.hide(true);
    },
    setInputValue: function () {
        for (let i = 0; i < this.aCustomInputList.length; i++) {
            if (this.aInputNum[i]) {
                if (this.aCustomInputList[i].innerHTML) {
                    continue;
                } else {
                    if (!this.isShowInput) {
                        this.aCustomInputList[i].innerHTML = this.inputTag;
                    } else {
                        this.aCustomInputList[i].innerHTML = this.aInputNum[i];
                    }
                }
            } else {
                this.aCustomInputList[i].innerHTML = '';
            }
        }
    }
};

export { cInputKeyboard };