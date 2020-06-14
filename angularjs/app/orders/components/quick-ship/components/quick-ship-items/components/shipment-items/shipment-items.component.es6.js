import { shipmentDeliveryMethodConstants } from '../../../../../../../core/constants/order.constants.es6';
import template from './shipment-items.html';
import actions from '../../../../actions/quick-ship.actions.es6.js';

class shipmentItemsCtrl {
    constructor(
        $ngRedux,
        $state,
        corePatientService
    ) {
        'ngInject';

        this.corePatientService = corePatientService;

        this.$ngRedux = $ngRedux;
        this.$state = $state;

        this.deliveryMethodsIds = shipmentDeliveryMethodConstants;
        this.shipmentDeliveryMethod = null;
    }

    applyMethodToAll() {
        this.$ngRedux.dispatch(actions.setDeliveryMethodToAll(this.shipmentDeliveryMethod));
    }

    resetAllMethods() {
        this.shipmentDeliveryMethod = null;
        this.$ngRedux.dispatch(actions.setDeliveryMethodToAll(null));
    }

    getUnfulfilledItemsAmount() {
        if (!_.isEmpty(this.shipItemsForm.$error)) {
            return Math.max(
                Object.keys(this.shipItemsForm.$error)
                         .map((err) => this.shipItemsForm.$error[err].length)
            );
        }
        return 0;
    }

    goToAddItems() {
        this.$state.go('root.orders.quick_ship.add_items');
    }
}

const shipmentItems = {
    bindings: {
        products: '<',
        linkedItems: '<',
        linkedItemComponents: '=',
        inventory: '<',
        deliveryMethods: '<',
        deliveryCompanies: '<'
    },
    template,
    controller: shipmentItemsCtrl
};

export default shipmentItems;
