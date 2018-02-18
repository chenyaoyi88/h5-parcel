import '../sass/index.scss';
import { toast, loading, modal } from '../component';
import { Tool, ajax, api } from './util';
import { weixin } from './weixin';
import { modalConfig } from './config';

Tool.domReady(function () {
    weixin.init();

    document.addEventListener('click', function (ev) {
        const oEvent = ev || event;
        const oTarget = oEvent.srcElement || oEvent.target;

        switch (oTarget['id']) {
            case 'show-modal-text':
                modal.show(modalConfig({
                    code: 'success',
                    content: '测试弹窗显示文字'
                }));
                break;
            case 'show-modal-img':
                modal.show(modalConfig({
                    code: 'success'
                }));
                break;
            case 'show-modal-cb':
                modal.show(modalConfig({
                    code: 'success',
                    beforeOpenCallback: function () {
                        alert('准备打开弹窗');
                    },
                    openCallback: function () {
                        alert('弹窗打开结束');
                    },
                    confirmCallback: function () {
                        alert('弹窗关闭结束');
                    }
                }));
                break;
            case 'show-toast':
                toast('这是测试 toast 提示');
                break;
            case 'show-loading':
                loading.show();
                setTimeout(function () {
                    loading.hide();
                }, 2000);
                break;
        }

    }, false);
});