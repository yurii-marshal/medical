import { importPaymentStatusConstants } from '../../../core/constants/billing.constants.es6';

// Modal Controllers
import selectPayerModalController from '../controllers/modals/selectPayerModal.controller.es6';

// Modal Templates
import selectPayerModalTemplate from '../../views/modals/selectPayerModal.html';

export default class eobEraService {
    constructor($mdDialog, $http, WEB_API_BILLING_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    getTransactionPayments(filter, sortExpression, pageIndex, pageSize) {
        let params = this.infinityTableFilterService.getFilters(filter);

        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        if (params.CreatedOn) {
            params.CreatedOn = moment(params.CreatedOn).format();
        }

        params = angular.merge(params, { pageSize, pageIndex, sortExpression });

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/import-payments`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.statusClass = getStatusClass(item.Status.Status.Id));
                return response;
            });

        function getStatusClass(importPaymentStatusId) {
            switch (importPaymentStatusId) {
                case importPaymentStatusConstants.FAILED_STATUS_ID: // 0
                    return 'red';
                case importPaymentStatusConstants.PROCESSED_STATUS_ID: // 1
                    return 'dark-blue';
            }
        }
    }

    openSelectPayerModal(importPaymentId) {
        this.$mdDialog.show({
            template: selectPayerModalTemplate,
            controller: selectPayerModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { importPaymentId }
        });
    }

    connectSelectedPayer(importPaymentId, payerId) {
        let data = { PayerId: payerId };
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/import-payments/${importPaymentId}/connect`, data);
    }
}
