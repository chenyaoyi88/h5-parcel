import './toast.scss';

interface Options_Toast {
  // 显示时间
  duration?: number;
}

/**
 * toast 显示
 * @param {*String} text 要显示的文本内容
 */
function toast(text: string, options: Options_Toast = {}) {

  const sToastID = `cyy-toast-${new Date().getTime()}`;

  if (document.getElementById(sToastID)) {
    return false;
  }

  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class='toast' id='${sToastID}'>
        <div class='toast-wrap'>
            <div data-id="toast-content" class='toast-content'>${text || '--'}</div>
        </div>
    </div>`
  );

  const oToast = document.getElementById(sToastID);
  const oToastText = oToast.querySelector(
    '[data-id=toast-content]'
  ) as HTMLDivElement;

  oToastText.classList.add('slideInUp', 'animated');

  if (options.duration) {
    oToastText.style.webkitAnimationDuration = options.duration + 's';
  }

  oToastText.addEventListener('webkitAnimationEnd', function () {
    document.body.removeChild(oToast);
  });
};


export { toast };
