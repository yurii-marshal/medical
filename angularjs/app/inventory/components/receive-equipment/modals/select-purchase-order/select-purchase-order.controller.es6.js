export default class SelectPurchaseOrderCtrl {
    constructor(
        $mdDialog,
        $scope,
        $state,
        bsLoadingOverlayService,
        purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.totalCount = null;

        this.purchaseOrderList = [];

        this.selectedOrder = null;

        this.filtersObj = {
            DisplayId: null,
            PageIndex: 0
        };

        this.getItems();
    }

    getItems(isNeedConcat) {
        this.bsLoadingOverlayService.start({ referenceId: 'selectPurchaseOrder' });

        if (!isNeedConcat) {
            this.filtersObj.PageIndex = 0;
        }

        this.filtersObj.selectCount = true;

        this.purchaseOrdersHttpService.getPurchaseOrders(this.filtersObj)
            .then((response) => {

                this.bsLoadingOverlayService.stop({ referenceId: 'selectPurchaseOrder' });

                this.totalCount = response.data.Count;

                if (isNeedConcat) {
                    this.purchaseOrderList = this.purchaseOrderList.concat(response.data.Items);
                } else {
                    this.purchaseOrderList = response.data.Items;
                }
            });
    }

    clearFilters() {
        this.filtersObj = {
            DisplayId: null,
            PageIndex: 0
        };


        this.selectedOrder = null;
        this.getItems();
    }

    showMore() {
        this.filtersObj.PageIndex++;
        this.getItems(true);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.selectedOrder);
    }
}
