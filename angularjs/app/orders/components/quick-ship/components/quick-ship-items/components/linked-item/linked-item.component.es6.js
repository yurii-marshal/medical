import template from './linked-item.html';

import actions from '../../../../actions/quick-ship.actions.es6';

class linkedItemComponentCtrl {
    constructor($ngRedux) {
        'ngInject';

        this.copiedLinkedItem = angular.copy(this.linkedItem);
        this.$ngRedux = $ngRedux;

        // It Needs for testing shippo service
        this.excludeValidations = [];

        this.isRequiredDeliveryCompany = false;
    }

    // It Needs for testing shippo service
    getExcludeValidators() {
        return [
            'SHIPPO_TRANSIT',
            'SHIPPO_DELIVERED',
            'SHIPPO_FAILURE',
            'SHIPPO_RETURNED',
            'SHIPPO_UNKNOWN',
            'SHIPPO_PRE_TRANSIT'
        ];
    }

    onChangeDeliveryCompany(deliveryCompany, hash) {

        // It Needs for testing shippo service
        if (deliveryCompany === 'shippo') {
            this.excludeValidations = this.getExcludeValidators();
        } else {
            this.excludeValidations = [];
        }

        this.$ngRedux.dispatch(actions.updateLinkedItem({
            itemChanges: { deliveryCompany },
            hash
        }));
    }

    onUpdateShipDate(shipDate, hash) {
        this.$ngRedux.dispatch(actions.updateLinkedItem({
            itemChanges: { shipDate },
            hash
        }));
    }

    onUpdateTrackingNumber(trackingNumber, hash) {
        const itemChanges = { trackingNumber };

        this.$ngRedux.dispatch(actions.updateLinkedItem({
            itemChanges,
            hash
        }));

        this.isRequiredDeliveryCompany = !!trackingNumber;
    }

    onRemoveItem(hash) {
        this.$ngRedux.dispatch(actions.removeLinkedItem({
            hash,
            productHash: this.productHash
        }));
    }

    $onChanges() {
        this.copiedLinkedItem = angular.copy(this.linkedItem);
    }
}

const linkedItem = {
    bindings: {
        index: '<',
        linkedItem: '<',
        linkedItemComponents: '<',
        deliveryCompanies: '<',
        productHash: '<'
    },
    template,
    controller: linkedItemComponentCtrl
};

export default linkedItem;
