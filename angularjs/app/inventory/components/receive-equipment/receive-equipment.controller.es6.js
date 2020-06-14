import actions from '../../../core/actions/inventory_receive.actions.es6.js';
import SelectPurchaseOrderCtrl from './modals/select-purchase-order/select-purchase-order.controller.es6';

export default class receiveEquipmentController {
    constructor($scope,
                $state,
                $ngRedux,
                bsLoadingOverlayService,
                $mdDialog,
                ngToast,
                receiveEquipmentService,
                purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.ngToast = ngToast;
        this.$ngRedux = $ngRedux;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.receiveEquipmentService = receiveEquipmentService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.isLoading = false;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

        $scope.$on('$destroy', unsubscribe);
        this.resetPairList();
    }

    mapStateToThis(state) {
        return {
            pairList: state.inventoryReceive.pairList
        };
    }

    editPurchasePriceModal(event, index) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/modify-purchase-price/modify.purchase.price.html',
            controller: 'modifyPurchasePriceController as $ctrl',
            clickOutsideToClose: true,
            locals: {
                purchasePrice: this.pairList[index].product.PurchasePrice
            }
        }).then((price) => {
            this.pairList[index].product.PurchasePrice = price;
            this.setPairList(this.pairList);
        });
    }

    selectPurchaseOrderModal(event, index) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/select-purchase-order/select-purchase-order.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: SelectPurchaseOrderCtrl,
            controllerAs: 'modal',
            locals: {}
        }).then((selectedPurchaseOrder) => {

            this.pairList[index].purchaseOrder = selectedPurchaseOrder;

            this.bsLoadingOverlayService.start({ referenceId: 'receive-equipment' });

            this.purchaseOrdersHttpService.getPurchaseOrder(selectedPurchaseOrder.Id)
                .then((response) => {

                    this.bsLoadingOverlayService.stop({ referenceId: 'receive-equipment' });

                    this.pairList[index].purchaseOrder.Items = response.data.Items;
                    this.setPairList(this.pairList);
                });
        });
    }

    searchLocationModal(event, index) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/location-dialog/search-locations-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: 'locationDialogController as modal',
            locals: {
                inventoryAction: undefined,
                isAnyLocation: undefined,
                locationTypeId: undefined,
                storeIds: null
            }
        })
            .then((newLocation) => {

                this.pairList[index].location = newLocation;
                this.setPairList(this.pairList);
            });
    }

    deleteProduct(index) {
        this.pairList.splice(index, 1);
        this.setPairList(this.pairList);
    }

    finish() {
        const emptyBundle = this.pairList.find((pairData) => {
            return pairData.product.isBundle && pairData.product.Components.length === 0;
        });

        if (emptyBundle) {
            this.ngToast.danger('Bundle components are invalid');

            return;
        }

        this.isLoading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep2' });

        this.receiveEquipmentService.finishReceive(this.pairList)
            .then(() => {
                this.resetPairCurrent();
                this.resetPairList();

                this.ngToast.success('Equipment receive done.');
                this.$state.go('root.inventory.list');
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep2' });
                this.isLoading = false;
            });
    }


    // dispatch redux actions
    setPairList(pairList) {
        this.$ngRedux.dispatch(actions.setPairList(pairList));
    }

    resetPairList() {
        this.$ngRedux.dispatch(actions.resetPairList());
    }

    resetPairCurrent() {
        this.$ngRedux.dispatch(actions.resetPairCurrent());
    }
}
