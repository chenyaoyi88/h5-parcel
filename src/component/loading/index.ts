import './loading.scss';

const loading = {
    sLoadingID: '',
    show: function (text: string = '加载中') {

        this.sLoadingID = `cyy-loading-${new Date().getTime()}`;

        if (document.getElementById(this.sLoadingID)) {
            return false;
        }
        document.body.insertAdjacentHTML(
            'beforeend',
            `
                <div class="loading" id="${this.sLoadingID}">
                    <div class="loading-timer"></div>
                    <div class="loading-text">${text}</div>
                </div>
                `
        );
    },
    hide: function () {
        const oLoading = document.getElementById(this.sLoadingID);
        if (!oLoading) {
            return false;
        }
        document.body.removeChild(oLoading);
    }
}

export { loading };