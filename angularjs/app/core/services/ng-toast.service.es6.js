export default class NgToast {
    constructor(iframeUtils) {
        'ngInject';

        this.iframeUtils = iframeUtils;
    }

    success(text) {
        this.iframeUtils.sendToastToParentIframe('success', text);
    }

    danger(text) {
        this.iframeUtils.sendToastToParentIframe('danger', text);
    }

    warning(text) {
        this.iframeUtils.sendToastToParentIframe('warning', text);
    }

    info(text) {
        this.iframeUtils.sendToastToParentIframe('info', text);
    }
}
