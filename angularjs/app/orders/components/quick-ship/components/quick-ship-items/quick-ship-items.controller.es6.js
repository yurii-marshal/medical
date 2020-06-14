import actions from '../../actions/quick-ship.actions.es6.js';
import { mapQuickShipItemsRequest } from '../../map-ship-items-request.helper.es6';

export default class QuickShipItemsCtrl {
    constructor($q,
                $scope,
                $state,
                $ngRedux,
                quickShipService,
                corePatientService,
                coreOrderService,
                bsLoadingOverlayService,
                $mdDialog
                ) {
        'ngInject';

        this.$q = $q;
        this.$ngRedux = $ngRedux;
        this.$mdDialog = $mdDialog;

        this.$state = $state;
        this.quickShipService = quickShipService;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.orderId = $state.params.orderId;
        this.itemId = $state.params.itemId === 'update' ? undefined : $state.params.itemId;
        this.patientId = $state.params.patientId;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

        $scope.$on('$destroy', unsubscribe);
    }

    mapStateToThis(state) {

        return {
            orderShortInfo: state.quickShip.orderShortInfo,
            patientInfo: state.quickShip.patientInfo,
            shipItems: state.quickShip.shipItems,
            linkedItems: state.quickShip.linkedItems,
            inventory: state.quickShip.inventory,
            deliveryMethodDictionaries: state.dictionaries.deliveryMethodDictionaries,
            deliveryCompaniesDictionary: state.dictionaries.deliveryCompaniesDictionary
        };
    }

    save() {

        if (this.quickShipItemsForm.$invalid) {
            touchedErrorFields(this.quickShipItemsForm);
            return false;
        }

        const options = {
            model: mapQuickShipItemsRequest(this.shipItems, this.linkedItems),
            orderId: this.orderId,
            patientId: this.patientId,
            itemId: this.itemId || null
        };

        this.bsLoadingOverlayService.start({ referenceId: 'quickShipDetails' });
        this.quickShipService.shipItems(options)
            .then(() => this.cancel())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'quickShipDetails' }));
    }

    cancel() {
        this.$ngRedux.dispatch(actions.resetQuickShipState());
        this.$state.go('root.orders.order.items', { orderId: this.orderId });
    }

}
