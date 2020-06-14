export default class itemTrackingStatusModalController {
    constructor($rootScope, $mdDialog, bsLoadingOverlayService, ordersService, orderId, itemId, actionTypeId) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;
        this.orderId = orderId;
        this.itemId = itemId;
        this.actionTypeId = +actionTypeId;

        this.date = '';
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: "modalOverlay" });

            if (this.actionTypeId === 1) {
                // backordered

                this.ordersService.backorderItem(this.orderId, this.itemId, this.date)
                    .then(response => {
                        this.$mdDialog.hide();
                        this.$rootScope.$broadcast('reloadOrderItems');
                        this.$rootScope.$broadcast('orderUpdated');
                    })
                    .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: "modalOverlay" }));

            } else if (this.actionTypeId === 3) {
                // mark as delivered

                this.ordersService.markAsDelivered(this.orderId, this.itemId, this.date)
                    .then(response => {
                        this.$mdDialog.hide();
                        this.$rootScope.$broadcast('reloadOrderItems');
                    })
                    .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: "modalOverlay" }));
            }

        } else {
            touchedErrorFields(this.form);
        }
    }
}
