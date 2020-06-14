// Modal Controllers
import documentUpdateModalController from '../../scripts/controllers/modals/documentUpdateModal.controller.es6.js';

// Modal Templates
import documentUpdateModalTemplate from '../../views/modals/document-update-modal.html';

export default class documentUpdateService {
    constructor($http,
                $window,
                ngToast,
                $mdDialog,
                fileService,
                authService,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI,
                $q
    ) {
        'ngInject';

        this.$http = $http;
        this.$window = $window;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.fileService = fileService;
        this.authService = authService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.$q = $q;

        this.params = {
            prescriptions: {
                endPoints: {
                    electronically: '', // not implemented on back
                    fax: 'v1/sales-orders/prescriptions/send-fax',
                    print: 'v1/sales-orders/prescriptions/', // + ${param}/print in documentUpdateByPrint()
                    download: 'v1/sales-orders/prescriptions/print'
                },
                dataModelName: 'Ids'
            },
            cmns: {
                endPoints: {
                    electronically: 'v1/patients/cmn-documents/send-alert', // not implemented on back
                    fax: 'v1/patients/cmn-documents/send-fax',
                    print: 'v1/patients/cmn-documents/', // + ${param}/print in documentUpdateByPrint()
                    download: 'v1/patients/cmn-documents/print'
                },
                dataModelName: 'PatientDocumentIds'
            }
        };

    }

    openDocumentUpdateModal(options, actions, ids, stateName) {
        this.$mdDialog.show({
            template: documentUpdateModalTemplate,
            controller: documentUpdateModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { options, actions, ids, stateName }
        });
    }

    documentUpdateByPrint(stateName, ids) {
        let param = ids[0];
        let url = `${this._getEndPoint(stateName, 'print')}${param}/print`;
        let token = this.authService.getAccessToken();
        let fileUrl = `${url}?access_token=${token}`;

        this.fileService.open(fileUrl);
    }

    printInvoice(invoiceId) {
        return this.fileService.openFileOnTab({ url: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/print` });
    }

    /**
     *
     * @param invoiceId
     * @param isBlank - default false, in this case cms will be generated with data only to be printed at the special blank;
     *                  if true, regular fulfilled cms1500 document will be generated
     * @returns Promise
     */
    openCMS1500(invoiceId, isBlank) {
        return this.fileService.openFileOnTab({ url: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/cms-1500?isEmpty=${!isBlank}` });
    }

    openFileByJobId(jobId) {
        return this.fileService.openFileOnTab({
            url: `${this.WEB_API_BILLING_SERVICE_URI}v1/jobs/${ jobId }/file`
        });
    }

    openCMS1500ByIds(requestData) {
        return this.fileService.openFileOnTab({
            url: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/cms-1500`,
            method: 'POST',
            requestData: requestData,
            noShowPopup: true
        });
    }


    downloadFiles(stateName, ids) {
        const defer = this.$q.defer();
        const token = this.authService.getAccessToken();

        let data = { [`${this.params[stateName].dataModelName}`]: ids };

        let x = new XMLHttpRequest();

        x.open('POST', this._getEndPoint(stateName, 'download'), true);
        x.setRequestHeader('Authorization', `Bearer ${token}`);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        x.responseType = 'blob';

        x.onload = function(e) {
            defer.resolve();
            download(e.target.response, 'cmn-documents.zip', e.target.response.type);
        };
        x.onerror = function() {
            defer.reject();
        };

        x.send(JSON.stringify(data));
        return defer.promise;
    }

    documentUpdateByFax(stateName, ids, fax) {
        let data = { Fax: fax, [`${this.params[stateName].dataModelName}`]: ids };

        return this.$http({
            url: this._getEndPoint(stateName, 'fax'),
            method: 'POST',
            data
        });
    }

    _getEndPoint(stateName, actionType) {
        switch(stateName) {
            case 'prescriptions':
                return `${this.WEB_API_SERVICE_URI}${this.params.prescriptions.endPoints[actionType]}`;
            case 'cmns':
                return `${this.WEB_API_SERVICE_URI}${this.params.cmns.endPoints[actionType]}`;
        }
    }

}
