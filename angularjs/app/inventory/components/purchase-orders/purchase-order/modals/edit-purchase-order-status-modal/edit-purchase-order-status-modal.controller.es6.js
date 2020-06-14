export default class editPurchaseOrderStatusModalController {
    constructor($rootScope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                purchaseOrdersHttpService,
                purchaseOrderId,
                model,
                statuses
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;
        this.purchaseOrderId = purchaseOrderId;
        this.model = angular.copy(model);
        this.statuses = statuses;
    }

    save() {
        if (!this.Form.$valid) {
            touchedErrorFields(this.Form);
            return;
        }
        const model = {
            Id: this.purchaseOrderId,
            Status: this.model.Status.Id
        };

        this.bsLoadingOverlayService.start({ referenceId: 'editPurchaseOrderStatusModal' });
        this.purchaseOrdersHttpService.editPurchaseOrderStatus(model)
            .then(() => {
                this.$mdDialog.hide(this.model);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editPurchaseOrderStatusModal' }));
    }

    close() {
        this.$mdDialog.cancel();
    }
}
