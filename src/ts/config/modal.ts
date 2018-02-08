import * as IMG_info from '../../images/info.png';

interface ModalConfig {
  // 状态码
  code?: string;
  // 是否显示动画
  isShowAnimate?: boolean;
}

/**
 * 弹窗的公共配置
 * @param type 弹窗的类型
 */
const modalConfig = function (options?: ModalConfig) {
  let imgSrc = '';
  let text1 = '';
  let type = '';

  switch (options.code) {
    case 'error':
      type = 'error';
      imgSrc = IMG_info;
      text1 = '网络繁忙，请稍后再试！';
    default:
      type = 'error';
      imgSrc = IMG_info;
      text1 = '网络繁忙，请稍后再试！';
  }
  return {
    modalClass: `act-other ${type}`,
    content: `
        <div class="modal-img-wrap">
            <img class="img" src="${imgSrc}" alt="">
        </div>
        <div class="modal-text">
            <p class="text">${text1}</p>
        </div>
        `,
    confirmText: '我知道了',
    isShowAnimate: options.isShowAnimate || false
  };
};

export { modalConfig };
