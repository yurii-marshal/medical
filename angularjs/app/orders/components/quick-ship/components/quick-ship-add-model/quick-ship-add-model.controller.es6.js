import { normalizeSearchItemsData } from '../../../../../core/services/http/inventory/inventory-product/product-search-items.normalization.es6';

import actions from '../../actions/quick-ship.actions.es6.js';

export default class QuickShipAddModelCtrl {
    constructor(
        $q,
        $scope,
        $state,
        $ngRedux,
        bsLoadingOverlayService,
        quickShipService
    ) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.quickShipService = quickShipService;
        this.$ngRedux = $ngRedux;
        this.$state = $state;
        this.items = [];
    }

    cancel() {
        this.$state.go('root.orders.quick_ship.items');
    }

    save() {
        const newItems = normalizeSearchItemsData({
                Count: null,
                Items: this.items
            }),
            shipItemsIds = newItems.items.allHashes.reduce((acc, hash) => {
                acc.push(newItems.items.byHash[hash].productId);
                return acc;
            }, []);

        this.$ngRedux.dispatch(actions.addQuickShipItems(newItems));

        this.bsLoadingOverlayService.start({ referenceId: 'quickShipAddModel' });
        return this.quickShipService.getProductsById(_.uniq(shipItemsIds))
            .then((response) => {
                this.$ngRedux.dispatch(actions.setAmountFromInventory(response));
                this.$state.go('root.orders.quick_ship.items');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'quickShipAddModel' }));
    }
}
