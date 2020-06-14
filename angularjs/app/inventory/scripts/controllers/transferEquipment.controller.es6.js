import actions from '../../../core/actions/inventory_transfer.actions.es6.js';

export default class transferEquipmentController {
    constructor($scope,
                $state,
                bsLoadingOverlayService,
                $mdDialog,
                $ngRedux,
                ngToast,
                $timeout,
                transferEquipmentService) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$ngRedux = $ngRedux;
        this.ngToast = ngToast;
        this.$timeout = $timeout;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.transferEquipmentService = transferEquipmentService;

        this.isLoading = false;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);
        $scope.$on('$destroy', unsubscribe);

        this.resetPairList();
    }

    mapStateToThis(state) {
        return {
            pairList: state.inventoryTransfer.pairList
        }
    }

    qtyChanged(item, index) {
        let isValid = item.Count <= item.maxCount;
        if (!isValid) {
            this.reviewItemsForm[`product_qty_${index}`].$setTouched();
        } else {
            this.reviewItemsForm[`product_qty_${index}`].$setUntouched();
        }

        this.$timeout(() => this.reviewItemsForm[`product_qty_${index}`].$setValidity('max', isValid));
    }

    searchLocationToModal(event, index) {
        this.$mdDialog.show({
            templateUrl: 'inventory/views/modals/search-locations-complex-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: 'locationComplexDialogController as modal',
            locals: {

                //TODO find out what does LocationUniqueId exactly mean
                excludeLocations: [this.pairList[index].product.LocationUniqueId]
            }
        })
        .then((newLocation) => {
            this.pairList[index].locationTo = newLocation;
            this.setPairList(this.pairList);
        });
    }

    deleteProduct(index) {
        this.pairList.splice(index, 1);
        this.setPairList(this.pairList);
    }

    finish() {
        if (this.reviewItemsForm.$invalid) {
            touchedErrorFields(this.reviewItemsForm);
            return;
        }

        this.isLoading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'receive-equipment' });
        this.transferEquipmentService.finishTransfer(this.pairList)
            .then(() => {
                this.resetPairCurrent();
                this.resetPairList();

                this.ngToast.success('Equipment transfer done.');
                this.$state.go('root.inventory.list');
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'receive-equipment' })
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
