import actions from './actions/quick-ship.actions.es6.js';
import dictionariesActions from './actions/dictionaries.actions.es6.js';

import { initialQuickShipState } from './reducers/initial-state.helper.es6.js';
import { orderTrackingStatusesConstants } from '../../../core/constants/order.constants.es6';

export default class QuickShipCtrl {
    constructor(
        $q,
        $scope,
        $state,
        $ngRedux,
        quickShipService,
        coreOrderService,
        corePatientService,
        bsLoadingOverlayService
    ) {
        'ngInject';

        this.$q = $q;
        this.$state = $state;
        this.$ngRedux = $ngRedux;
        this.quickShipService = quickShipService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.orderId = $state.params.orderId;
        this.itemId = $state.params.itemId === 'update' ? undefined : $state.params.itemId;
        this.patientId = $state.params.patientId;

        this.coreOrderService = coreOrderService;
        this.corePatientService = corePatientService;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

        $scope.$on('$destroy', unsubscribe);

        $scope.$on('$stateChangeSuccess', () => this._checkState());
        $scope.$on('$stateChangeStart', (event, toState) => {
            const quickShipUrl = new RegExp(/(root.orders.quick_ship)/);

            if (!quickShipUrl.test(toState.name)) {
                this.$ngRedux.dispatch(actions.resetQuickShipState());
            }
        });

        // redirection on page reload
        if (!this.$state.is('root.orders.quick_ship.items')) {
            this.$state.go('root.orders.quick_ship.items');
        }

        this._activate();
    }

    mapStateToThis(state) {
        return {
            orderShortInfo: state.quickShip.orderShortInfo,
            shipItems: state.quickShip.shipItems
        };
    }

    _checkState() {
        if ( this.$state.is('root.orders.quick_ship')) {
            this.$state.go('root.orders.quick_ship.items', {
                orderId: this.orderId,
                itemId: this.itemId,
                patientId: this.patientId
            });
        }
    }

    _activate() {

        const itemsRequestPromise = this.itemId ?
            this.quickShipService.getOrderTrackingItemById(this.orderId, this.itemId) :
            this.quickShipService.getOrderItems(this.orderId);

        this.bsLoadingOverlayService.start({ referenceId: 'quickShipDetails' });

        this.coreOrderService.getDeliveryMethodDictionaries()
            .then((response) => {
                this.$ngRedux.dispatch(dictionariesActions.setDeliveryMethodDictionaries(response));
            });

        this.corePatientService.getDeliveryCompanies()
            .then((response) => {
                this.$ngRedux.dispatch(dictionariesActions.setDeliveryCompaniesDictionary(response));
            });

        // for order item instead of calling all
        const orderDetailsPromises = [
            this.quickShipService.getOrderShortInfo(this.orderId),
            this.quickShipService.getPatientInfoById(this.patientId),
            itemsRequestPromise
        ];

        this.$q.all(orderDetailsPromises)
        // OrderShortInfo + PatientInfo + OrderItems without components
            .then((responses) => {

                /* store summary info */
                this.$ngRedux.dispatch(actions.setOrderShortInfo(responses[0]));
                this.$ngRedux.dispatch(actions.setPatientInfo(responses[1]));

                if (this.itemId) {
                    this.$ngRedux.dispatch(actions.setShipItems(responses[2]));
                } else {
                    const orderItems = responses[2].items;

                    // If ship was called for all items
                    const itemsInPendingStatus = this._filterPendingItems(orderItems);

                    this.$ngRedux.dispatch(actions.setShipItems(itemsInPendingStatus));
                }

                const componentsPromises = this.shipItems.items.allHashes
                    .reduce((promises, hash) => {
                        const item = this.shipItems.items.byHash[hash];

                        if (item.isBundle) {
                            promises.push(this.quickShipService.getBundleComponents(item.productId, hash));
                        }

                        return promises;
                    }, []);

                if (componentsPromises.length) {
                    return this.$q.all(componentsPromises);
                }

                return null;
            })
            // Components for each bundle Order Item
            .then((responses) => {

                if (responses) {
                    this.$ngRedux.dispatch(actions.attachComponents(responses));
                }

                this.$ngRedux.dispatch(actions.divideNotMultiple(this.shipItems));

                const shipItemsIds = this.shipItems.items.allHashes.reduce((acc, hash) => {
                    acc.push(this.shipItems.items.byHash[hash].productId);
                    return acc;
                }, []);

                return this._checkItemsAtInventory(shipItemsIds);
            })
            // TODO Change Map amount at inventory to PROPER name and move reducer
            .then((response) => {
                this.$ngRedux.dispatch(actions.setAmountFromInventory(response));
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'quickShipDetails' }));
    }

    _filterPendingItems(orderItems) {
        let startObj = angular.copy(initialQuickShipState().shipItems);

        return orderItems.allHashes.reduce((acc, hash) => {

            if ( orderItems.byHash[hash].status === orderTrackingStatusesConstants.PENDING_ID ||
                 orderItems.byHash[hash].status === orderTrackingStatusesConstants.REJECTED_ID
            ) {
                acc.items.allHashes.push(hash);
                acc.items.byHash[hash] = Object.assign({}, orderItems.byHash[hash]);
            }
            return acc;
        }, startObj);
    }

    _checkItemsAtInventory(shipItemsIds) {
        this.bsLoadingOverlayService.start({ referenceId: 'quickShipDetails' });
        return this.quickShipService.getProductsById(_.uniq(shipItemsIds))
            .then((products) => products)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'quickShipDetails' }));
    }

    cancel() {
        this.$ngRedux.dispatch(actions.resetQuickShipState());
        this.$state.go('root.orders.order.items', { orderId: this.orderId });
    }

}
