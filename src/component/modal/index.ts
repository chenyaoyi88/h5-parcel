import './modal.scss';

interface Options_ShowModal {
  // 要现实的文本
  content: string;
  // 是否展示动画
  isShowAnimate?: boolean;
  // 动画延时
  duration?: number;
  // modal 另外添加的样式名
  modalClass?: string;
  // modalWrap 另外添加的样式名
  modalWrapClass?: string;
  // textWrap 另外添加的样式名
  textWrapClass?: string;
  // contentWrap 另外添加的样式名
  contentWrapClass?: string;
  // 确定按钮文字
  confirmText?: string;
  // 确定按钮自定义
  confirmHtml?: string;
  // 确定按钮回调
  confirmCallback?: Function;
  // 关闭按钮回调
  closeCallback?: Function;
  // 打开弹窗回调
  openCallback?: Function;
  // 打开弹窗之前回调
  beforeOpenCallback?: Function;
  // 点击弹框背景遮罩层是否可以关闭弹窗
  isClickBgClose?: boolean;
}

class Modal {
  oModalEle: any = null;
  oBody: any = null;
  oBodyCurPos: number = 0;
  sModalId: string = '';
  options: Options_ShowModal;
  duration: number = 300;

  constructor() { }

  create(options: Options_ShowModal) {
    // 判断字符串里有没有标签
    let sContentHtml = '';
    if (/<[^>]+>/g.test(options.content)) {
      sContentHtml = options.content;
    } else {
      sContentHtml = `
              <div class="modal-text">
                  <p class="text">${options.content}</p>
              </div>
              `;
    }

    // 判断字符串里有没有标签
    let sBtnWrapHtml = '';
    if (/<[^>]+>/g.test(options.confirmHtml)) {
      sBtnWrapHtml = `
        <div data-id="modal-close-btn">${options.confirmHtml}</div>
      `;
    } else {
      sBtnWrapHtml = `
        <button data-id="modal-close-btn" class="modal-btn">${options.confirmText || '知道了'}</button>
      `;
    }

    this.oBody = document.body;
    this.options = options;
    this.sModalId = `cyy-modal-${new Date().getTime()}`

    this.oBody.insertAdjacentHTML(
      'beforeend',
      `<div class="modal ${
      options.isShowAnimate ? 'modal-animate' : ''
      } ${options.modalClass || ''}" id="${this.sModalId}">
            <div class="modal-wrap ${options.modalWrapClass || ''}">
                <div class="modal-content ${options.contentWrapClass || ''}">
                    <div data-id="modal-text-wrap" class="modal-text-wrap ${options.textWrapClass || ''}">
                        ${sContentHtml}
                    </div>
                    <div data-id="modal-btn-wrap" class="modal-btn-wrap">
                        ${sBtnWrapHtml}
                    </div>
                </div>
            </div>
            <div class="modal-bg" ${options.isClickBgClose ? 'data-id="modal-close-btn"' : ''}></div>
        </div>
        `
    );

    this.oModalEle = document.getElementById(this.sModalId) as HTMLDivElement;
  }

  close(event: any) {
    event.preventDefault();
    const oTarget = event.srcElement;
    const targetID = oTarget['dataset'].id;

    // 点击关闭
    if (targetID === 'modal-close-btn') {
      if (this.options.isShowAnimate) {
        // 如果是动画打开
        this.oModalEle.classList.remove('show-animate');

        setTimeout(() => {
          if (this.oBody.contains(this.oModalEle)) {
            this.oBody.removeChild(this.oModalEle);
            this.options.confirmCallback && this.options.confirmCallback();
            document.removeEventListener('click', this.close, false);
            this.remove = function () { };
          }
        }, this.duration);

      } else {
        // 非动画打开
        this.oBody.removeChild(this.oModalEle);
        this.options.confirmCallback && this.options.confirmCallback();
        document.removeEventListener('click', this.close, false);
        this.remove = function () { };
      }

      // 恢复位置
      this.oBody.style.overflow = '';
      this.oBody.style.position = null;
      this.oBody.style.top = null;
      window.scrollTo(0, this.oBodyCurPos);
    }
  }

  show(options?: Options_ShowModal) {
    // 防止重复生成
    if (document.getElementById(this.sModalId)) {
      return;
    }

    this.create(options);

    options.beforeOpenCallback && options.beforeOpenCallback();

    if (options.isShowAnimate) {
      setTimeout(() => {
        this.oModalEle.classList.add('show-animate');
      }, 50);
    }

    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || this.oBody.scrollTop
      || 0;
    this.oBodyCurPos = scrollTop;
    this.oBody.style.top = -1 * scrollTop + "px";
    this.oBody.style.position = 'fixed';

    setTimeout(() => {
      options.openCallback && options.openCallback()
    }, this.duration);


    this.remove();
  }

  remove() {
    document.addEventListener('click', (ev) => {
      this.close(ev);
    }, false);
  }

}

const modal = new Modal();

export { modal };
