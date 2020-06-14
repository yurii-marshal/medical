export default class PurchaseOrderItemsController {
    constructor($state,
                $scope,
                purchaseOrderManageService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;

        this.purchaseOrderManageService = purchaseOrderManageService;
        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.isFromManagePage = $state.params.isFromManagePage;
        this.products = [];

        this._activate();
    }

    _activate() {
        if (this.isFromManagePage) {
            this.model = this.purchaseOrderManageService.getModel();
        } else {
            this.purchaseOrderManageService.clearModel();
            this.model = this.purchaseOrderManageService.getModel();
        }
    }

    cancel() {
        if (this.isFromManagePage) {
            this._goToManagePurchaseOrder();
        } else {
            this.$state.go('root.inventory.purchase-orders');
        }
    }

    save() {
        this.products.forEach((item) => {
            item.Price = item.PurchasePrice;
            this.model.Products.push(item);
        });
        this._goToManagePurchaseOrder();
    }

    _goToManagePurchaseOrder() {
        if (this.purchaseOrderId) {
            this.$state.go('root.purchase-order-modify', { purchaseOrderId: this.purchaseOrderId, isFromItemsPage: true });
        } else {
            this.$state.go('root.purchase-order-create', { isFromItemsPage: true });
        }
    }
}
