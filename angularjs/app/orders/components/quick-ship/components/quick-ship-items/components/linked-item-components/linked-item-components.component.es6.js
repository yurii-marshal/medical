import template from './linked-item-components.html';
import { shipmentDeliveryMethodConstants } from '../../../../../../../core/constants/order.constants.es6';

class linkedItemComponentsCtrl {
    constructor(WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.deliveryMethodsIds = shipmentDeliveryMethodConstants;

        this.noImage = 'assets/images/colored/no-image-white.svg';
    }
}

const linkedItemComponents = {
    bindings: {
        linkedItemComponents: '<',
        linkedItemComponentsHashes: '<'
    },
    template,
    controller: linkedItemComponentsCtrl
};

export default linkedItemComponents;
