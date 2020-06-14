export default class PurchaseOrderPriceCtrl {
    constructor(
        $mdDialog,
        $scope,
        $state,
        bsLoadingOverlayService,
        purchaseOrdersHttpService,
        items
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.Items = items;

        this.selectedItem = null;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.selectedItem);
    }
}
