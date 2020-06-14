export default class IframeUtils {
    constructor() {
        'ngInject';
    }

    sendRedirectToParentIframe(url) {
        setTimeout(() => {
            const msg = {
                'msgType': 'RedirectUrl',
                'url': url
            };

            window.parent.postMessage(msg, '*');
        });
    }

    changeParentUrl(params, silent) {
        setTimeout(() => {
            const msg = {
                'msgType': 'Route',
                'url': params.url,
                'title': params.pageTitle,
                'topMenu': params.topMenu,
                'silent': !!silent
            };

            window.parent.postMessage(msg, '*');
        });
    }

    sendDataToParentIframe(toState, silent) {

        if (!toState.params) {
            return ;
        }

        setTimeout(() => {
            const msg = {
                'msgType': 'Route',
                'url': `/${ window.location.hash.substr(2)}`,
                'title': toState.params ? toState.params.pageTitle : '',
                'topMenu': toState.params ? toState.params.topMenu : '',
                'silent': !!silent
            };

            window.parent.postMessage(msg, '*');
        });
    }

    sendToastToParentIframe(type, text) {
        setTimeout(() => {
            const msg = {
                'msgType': 'Toast',
                'toastData': {
                    'type': type,
                    'text': text
                }
            };

            window.parent.postMessage(msg, '*');
        });
    }
}
