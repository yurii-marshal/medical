import template from './product-components.html';
import { shipmentDeliveryMethodConstants } from '../../../../../../../core/constants/order.constants.es6';
import actions from '../../../../actions/quick-ship.actions.es6';

class productComponentsCtrl {
    constructor(WEB_API_INVENTORY_SERVICE_URI, $ngRedux) {
        'ngInject';

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.$ngRedux = $ngRedux;

        this.deliveryMethodsIds = shipmentDeliveryMethodConstants;
        this.noImage = 'assets/images/colored/no-image-white.svg';
    }

    onChangeComponent(data, componentHash) {
        this.$ngRedux.dispatch(actions.updateShipComponent({
            data,
            hash: componentHash
        }));
    }
}

const productComponents = {
    bindings: {
        hash: '@',
        product: '<',
        components: '<'
    },
    template,
    controller: productComponentsCtrl
};

export default productComponents;
