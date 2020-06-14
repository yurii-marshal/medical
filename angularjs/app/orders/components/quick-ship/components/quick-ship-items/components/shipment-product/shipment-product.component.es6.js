import template from './shipment-product.html';
import { shipmentDeliveryMethodConstants } from '../../../../../../../core/constants/order.constants.es6';
import { limitConstants } from '../../../../../../../core/constants/core.constants.es6';
import actions from '../../../../actions/quick-ship.actions.es6';

class shipmentProductCtrl {
    constructor(
        $state,
        $scope,
        $ngRedux,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$state = $state;
        this.$ngRedux = $ngRedux;
        this.copiedProduct = angular.copy(this.product);
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.deliveryMethodsIds = shipmentDeliveryMethodConstants;

        this.noImage = 'assets/images/colored/no-image-white.svg';
        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;
        this.deliveryMethod = null;

        // It Needs for testing shippo service
        this.excludeValidations = [];

        this.isRequiredDeliveryCompany = false;
    }

    $onChanges() {
        this.copiedProduct = angular.copy(this.product);
    }

    pickItemFromInventory() {
        this.$ngRedux.dispatch(actions.setCurrentProduct(this.copiedProduct));

        if (this.copiedProduct.isBundle) {
            const filteredComponents = this.copiedProduct.componentsHashes.reduce((acc, hash) => {
                acc.allHashes.push(hash);
                acc.byHash[hash] = this.components.byHash[hash];

                return acc;
            }, { allHashes: [], byHash: {} });

            this.$ngRedux.dispatch(actions.setCurrentComponents(filteredComponents));
        }

        this.$state.go('root.orders.quick_ship.inventory_pick');
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

    getInventoryAvailable() {
        return this.inventory ? this.inventory.count - this.inventory.linkedCount : 0;
    }

    onChangeMethod(newMethod) {
        this.onChangeProduct({ deliveryMethod: newMethod });
        this.$ngRedux.dispatch(actions.resetItemProperties(this.copiedProduct));
    }

    onChangeDeliveryCompany(newCompany) {

        // It Needs for testing shippo service
        if (newCompany === 'shippo') {
            this.excludeValidations = this.getExcludeValidators();
        } else {
            this.excludeValidations = [];
        }

        this.onChangeProduct({ deliveryCompany: newCompany });
    }

    onChangeTrackingNumber(trackingNumber) {
        const changedData = { trackingNumber };

        this.onChangeProduct(changedData);
    }

    onChangeProduct(data) {
        this.$ngRedux.dispatch(actions.updateShipItem({
            data,
            hash: this.copiedProduct.hash
        }));

        this.isRequiredDeliveryCompany = !!this.copiedProduct.trackingNumber;
    }

    deleteProduct() {
        this.$ngRedux.dispatch(actions.deleteShipItem(this.copiedProduct));
    }
}

const shipmentProduct = {
    bindings: {
        index: '<',
        hash: '@',
        product: '<',
        inventory: '<',
        components: '<?',
        linkedItems: '<',
        linkedItemComponents: '<',
        deliveryCompanies: '<',
        deliveryMethods: '<'
    },
    template,
    controller: shipmentProductCtrl
};

export default shipmentProduct;
