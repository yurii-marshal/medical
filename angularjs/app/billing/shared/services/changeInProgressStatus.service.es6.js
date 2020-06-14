// Modal Controllers
import changeInProgressModalController from '../../scripts/controllers/modals/changeInProgressModal.controller.es6.js';
import changeInProgressStatusModalController from '../../scripts/controllers/modals/changeInProgressStatusModal.controller.es6.js';
import changeStatusModalController from '../../scripts/controllers/modals/changeStatusModal.controller.es6.js';

// Modal Templates
import changeInProgressModalTemplate from '../../views/modals/change-inprogress-status.html';
import changeStatusModalTemplate from '../../views/modals/change-status.html';

export default class changeInProgressStatusService {
    constructor($http, $mdDialog, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.$mdDialog = $mdDialog;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.params = {
            authorizations: {
                endPoint: `${this.WEB_API_SERVICE_URI}v1/patients/authorizations/`, //part of url / PUT method
                dataModelName: 'Ids'
            },
            prescriptions: {
                endPoint: `${this.WEB_API_SERVICE_URI}v1/prescriptions/progress`, //part of url / PUT method
                dataModelName: 'Ids'
            },
            cmns: {
                endPoint: `${this.WEB_API_SERVICE_URI}v1/patients/cmn-documents/`, //part of url / PUT method
                dataModelName: 'PatientDocumentIds'
            },
            denials: {
                endPoint_inProgress: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/denials/in-progress`, //full url / POST method
                endPoint_Status: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/denials/change-status`, //full url / POST method
                dataModelName: 'DenialIds'
            }
        };
    }

    changeInProgressStatus(status, ids, stateName) {
        let endPoint = this._getEndPoint(stateName);
        let inProgressStatus = status ? 'start-progress' : 'stop-progress';
        let url = `${endPoint}${inProgressStatus}`;
        let method = 'PUT';
        let data = {
            [`${this.params[stateName].dataModelName}`]: ids
        };

        if (stateName === 'denials') {
            url = endPoint;
            method = 'POST';
            data['InProgress'] = status;
        }

        if (stateName === 'prescriptions') {
            url = endPoint;
            data['Progress'] = status;
        }

        return this.$http({ url, method, data });
    }

    changeInProgress(status, ids, stateName) {
        let url = this._getEndPoint(stateName, 'in-progress');
        let method = 'PUT';
        let data = {
            [`${this.params[stateName].dataModelName}`]: ids,
            'InProgress': status
        };

        if (stateName === 'denials') {
            method = 'POST';
            data['InProgress'] = status;
        }

        return this.$http({ url, method, data });
    }

    changeStatus(status, ids, stateName) {
        let url = this._getEndPoint(stateName, 'status');
        let method = 'POST';
        let data = {
            [`${this.params[stateName].dataModelName}`]: ids,
            'Status': status
        };

        return this.$http({ url, method, data });
    }

    openChangeInProgressStatusModal(statuses, ids, stateName) {
        this.$mdDialog.show({
            template: changeInProgressModalTemplate,
            controller: changeInProgressStatusModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { statuses, ids, stateName }
        });
    }

    openChangeInProgressModal(statuses, ids, stateName) {
        this.$mdDialog.show({
            template: changeInProgressModalTemplate,
            controller: changeInProgressModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { statuses, ids, stateName }
        });
    }

    openChangeStatusModal(statuses, ids, stateName, allStatuses) {
        this.$mdDialog.show({
            template: changeStatusModalTemplate,
            controller: changeStatusModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { statuses, ids, stateName, allStatuses }
        });
    }

    _getEndPoint(stateName, param) {
        switch (stateName) {
            case 'authorizations':
                return this.params.authorizations.endPoint;
            case 'prescriptions':
                return this.params.prescriptions.endPoint;
            case 'cmns':
                return this.params.cmns.endPoint;
            case 'denials':
                return param === 'in-progress' ? this.params.denials.endPoint_inProgress : this.params.denials.endPoint_Status;
            default:
                break;
        }
    }
}
