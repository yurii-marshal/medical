import template from './payment-items-list.html';
import { paymentStatusConstants } from '../../../core/constants/billing.constants.es6';

class paymentItemsList {
    constructor($scope) {
        'ngInject';

        $scope.$watch(() => this.items, (newVal, oldVal) => {
            if (newVal&& newVal.length) {
                newVal.forEach((item) => item.statusClass = this._getStatusClass(item.Status.Id));
            }
        });
    }

    _getStatusClass(statusId) {
        switch (statusId) {
            case paymentStatusConstants.NEW_STATUS_ID:
                return 'green';
            case paymentStatusConstants.APPLIED_STATUS_ID:
                return 'blue';
            case paymentStatusConstants.UNAPPLIED_STATUS_ID:
                return 'dark-blue';
            case paymentStatusConstants.FAILED_STATUS_ID:
                return 'red';
            case paymentStatusConstants.COMPLETED_STATUS_ID:
            default:
                return 'gray';
        }
    }
}

export default {
    bindings: {
        items: '<',
    },
    template,
    controller: paymentItemsList
};
