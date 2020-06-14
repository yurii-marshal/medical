import template from './picked-items.html';
import actions from '../../../../actions/quick-ship.actions.es6.js';

class pickedItemsCtrl {
    constructor(
        WEB_API_INVENTORY_SERVICE_URI,
        quickShipService,
        $ngRedux
    ) {
        'ngInject';

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.quickShipService = quickShipService;
        this.$ngRedux = $ngRedux;

        this.noImage = 'assets/images/colored/no-image-white.svg';

    }

    deletePickedItem(id) {
        const item = this.pickedItems.items.byId[id];

        this.$ngRedux.dispatch(actions.resetTempCountLocationProductsCounter({
            hash: item.id
        }));

        this.$ngRedux.dispatch(actions.deletePickedItem(item));
    }

}

const pickedItems = {
    bindings: {
        pickedItems: '<'
    },
    template,
    controller: pickedItemsCtrl
};

export default pickedItems;

