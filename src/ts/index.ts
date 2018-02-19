import '../sass/index.scss';
import { domReady, http } from 'cyy-tool';
import { toast, loading, modal } from '../component';
import { api, appDownload } from './co';
import { weixin } from './weixin';
import { modalConfig } from './config';

domReady(function () {

    weixin.init();
    
    http.get('https://www.easy-mock.com/mock/5a30fa3f7ea45c08a5db3128/mock/user/list').then((res) => {
        console.log(res);
    });

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