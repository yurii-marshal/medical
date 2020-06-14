class fileService {
    constructor(
        $window,
        $mdDialog,
        $q,
        ngToast,
        authService
    ) {
        'ngInject';

        this.$window = $window;
        this.$mdDialog = $mdDialog;
        this.authService = authService;
        this.$q = $q;
        this.ngToast = ngToast;
    }

    open(url, pagetitle) {
        this._openFile(url, 'Open in new window', pagetitle);
    }

    download(url) {
        this._openFile(url, 'Download');
    }

    /**
     * @param {Object} params
     * @param {String} params.url request url
     * @param {String} params.method request method
     * @param {Object/Array} params.requestData request data
     * @param {String} params.noShowPopup block show download/open popup
     */

    openFileOnTab(params) {
        const defer = this.$q.defer();
        const context = this;
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // TODO test if AdBlock really detected by this function
        if (isAdBlockOn()) {
            this.ngToast.danger('The pop-up windows are blocked by one of your browser extensions.<br> Please disable it and reload page for further proceeding');
            defer.reject();
            return defer.promise;
        }
        const token = this.authService.getAccessToken();
        const xhr = new XMLHttpRequest();
        const requestMethod = params.method ? params.method : 'GET';

        xhr.open(requestMethod, params.url, true);

        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType = 'blob';

        xhr.onload = () => {
            if (iOS) {
                context.openDocumentByFileReader(xhr, defer, params.noShowPopup);
            } else {
                context.openDocumentByBlob(xhr, defer, params.noShowPopup);
            }
        };
        xhr.onerror = () => defer.reject();

        if (params.requestData) {
            xhr.send(JSON.stringify(params.requestData));
        } else {
            xhr.send();
        }

        return defer.promise;
    }

    // This way good work on IPad safari and IPad Chrome but for chrome an other platform has problem
    openDocumentByFileReader(xhr, defer) {
        const reader = new FileReader();
        const context = this;

        const file = new Blob([xhr.response], { type: xhr.response.type });

        reader.readAsDataURL(file);

        reader.onload = function() {
            context.open(reader.result);

            defer.resolve(reader.result);
        };
    }

    // This way for mac and window browsers
    openDocumentByBlob(xhr, defer, noShowPopup) {

        const file = new Blob([xhr.response], { type: xhr.response.type });

        const fileURL = URL.createObjectURL(file);

        defer.resolve(fileURL);

        if ((xhr.statusText.toLowerCase() === 'ok' || xhr.status === 200) && !noShowPopup) {

            if (xhr.response.type === 'application/pdf') {
                if (navigator.userAgent.indexOf('Chrome') > -1) {
                    this.open(`${fileURL}#page=1`); // Adding page number is fix render pdf form in Chrome
                } else {
                    this.open(fileURL);
                }
            } else {
                this.download(fileURL);
            }
        }
    }

    _openFile(url, buttonText, pagetitle = 'Document') {
        const newWindow = this.$window.open(url, '_blank');

        if (!newWindow) {
            this.$mdDialog.show({
                templateUrl: 'core/views/templates/modals/downloadFile.html',
                controller: downloadFileModalCtrl,
                controllerAs: 'modal',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { url, buttonText }
            });
        } else {
            // After loaded page, we check pagetitle for 2 minutes (if document loading too long)
            let intervalTime = 1000 * 60 * 2;
            let intervalId;

            newWindow.addEventListener('load', () => {
                intervalId = setInterval(() => {
                    if (intervalTime > 0) {
                        setTitle(newWindow);
                        intervalTime -= 300;
                    }
                }, 300);
            });

            newWindow.addEventListener('unload', (e) => clearInterval(intervalId));

            function setTitle(window) {
                let document = window.document;
                let html = document.getElementsByTagName('html')[0];
                let head = document.getElementsByTagName('head')[0];
                let body = document.getElementsByTagName('body')[0];
                let title = document.getElementsByTagName('title')[0];

                let headElement, newHead, titleElement;

                if (!html) { return false; }

                if (!head) {
                    headElement = document.createElement('head');
                    newHead = html.insertBefore(headElement, body)
                }

                if (!title) {
                    titleElement = document.createElement('title');

                    if (head) {
                        head.appendChild(titleElement);
                    } else {
                        newHead.appendChild(titleElement);
                    }
                }

                document.title = pagetitle;
            }
        }
    }
}

class downloadFileModalCtrl {
    constructor(url, buttonText, $mdDialog) {
        'ngInject';

        this.url = url;
        this.buttonText = buttonText || 'Download';
        this.cancel = $mdDialog.cancel;
    }
}

angular
    .module("app")
    .service("fileService", fileService);

